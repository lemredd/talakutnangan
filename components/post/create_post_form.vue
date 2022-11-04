<template>
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<DraftForm
				:id="CREATE_POST_FORM_ID"
				v-model="content"
				@submit-post="createPost">
				<div v-if="hasMultipleRoles" class="row role-selector flex flex-row">
					<SelectableOptionsField
						v-model="roleID"
						label="Post as: "
						placeholder="Choose the role"
						:options="roleNames"/>
				</div>
				<div
					v-if="maySelectOtherDepartments"
					class="row department-selector flex flex-row">
					<SelectableOptionsField
						v-model="departmentID"
						label="Department to post: "
						placeholder="Choose the department"
						:options="departmentNames"/>
				</div>
			</DraftForm>
			<ReceivedErrors
				v-if="receivedErrors.length"
				:received-errors="receivedErrors"/>
			<form @submit.prevent>
				<input
					type="hidden"
					name="data[type]"
					value="post_attachment"/>
				<input
					type="hidden"
					name="data[attributes][fileType]"
					:value="fileType"/>
				<label class="btn" for="choose-file-btn">
					<input
						id="choose-file-btn"
						type="file"
						name="data[attributes][fileContents]"
						:accept="accept"
						@change="uploadPostAttachment"/>
					CHOOSE FILE
				</label>
			</form>
			<div v-if="hasExtracted" class="preview-file">
				<div v-if="isAcceptingImage" class="preview-img-container">
					<img class="preview-img" :src="previewFile"/>
					<small class="preview-title">
						{{ filename }}
					</small>
				</div>
				<div
					v-if="isAcceptingFile"
					class="preview-file-container">
					<span class="material-icons mr-2">
						attachment
					</span>
					<small class="preview-file-title">
						{{ filename }}
					</small>
					<span
						class="remove-file-btn material-icons cursor-pointer"
						@click="removeFile">
						close
					</span>
				</div>
			</div>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="emitClose">
				Back
			</button>
			<button
				:disabled="!hasExtracted || isFileSizeGreaterThanLimit"
				:form="CREATE_POST_FORM_ID"
				class="btn submit-btn btn-primary"
				type="submit"
				@click="sendFile">
				Create post
			</button>
		</template>
	</overlay>
</template>


<style lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { UnitError } from "$/types/server"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedPostAttachmentResource } from "$/types/documents/post_attachment"
import { MAXIMUM_FILE_SIZE } from "$/constants/measurement"

import Fetcher from "$@/fetchers/post"
import PostAttachmentFetcher from "$@/fetchers/post_attachment"
import { post as permissionGroup } from "$/permissions/permission_list"
import { CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT } from "$/permissions/post_combinations"

import Overlay from "@/helpers/overlay.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import DraftForm from "@/post/draft_form.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"

type RequiredExtraProps = "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile, departments } = pageProps

const CREATE_POST_FORM_ID = "create-post"
const fetcher = new Fetcher()
const postAttachmentFetcher = new PostAttachmentFetcher()

const hasMultipleRoles = userProfile.data.roles.data.length > 1
const roleNames = computed<OptionInfo[]>(() => userProfile.data.roles.data.map(data => ({
	"label": data.name,
	"value": data.id
})))
const roleID = ref<string>(userProfile.data.roles.data[0].id)

const maySelectOtherDepartments = computed(() => {
	const targetRoleID = roleID.value
	const chosenRole = userProfile.data.roles.data.find(
		data => data.id === targetRoleID
	) as DeserializedRoleResource

	return permissionGroup.mayAllow(chosenRole, ...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
})
const departmentNames = computed<OptionInfo[]>(() => {
	const departmentNameOptions = maySelectOtherDepartments.value
		? []
		: [
			{
				"label": "All",
				"value": "*"
			},
			...departments.data.map(department => ({
				"label": department.fullName,
				"value": department.id
			}))
		]
	return departmentNameOptions
})
const departmentID = ref<string>(userProfile.data.department.data.id)

const content = ref<string>("")

const props = defineProps<{
	accept: "image/*" | "*/*"
	isShown: boolean
}>()
interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()

const isAcceptingImage = props.accept.includes("image/")
const isAcceptingFile = props.accept.includes("*/")

const filename = ref<string|null>(null)
const hasExtracted = computed<boolean>(() => filename.value !== null)
const previewFile = ref<any>(null)
const fileSize = ref<number|null>(null)
const isFileSizeGreaterThanLimit = computed(() => {
	const castedFileSize = fileSize.value as number
	return castedFileSize > MAXIMUM_FILE_SIZE
})
const fileType = ref<string>("")
const receivedErrors = ref<string[]>([])
const attachmentResources = ref<DeserializedPostAttachmentResource[]>([])

function removeFile() {
	filename.value = null
	previewFile.value = null
	fileSize.value = null
	receivedErrors.value = []
}

function emitClose() {
	emit("close")
}

function sendFile(form: HTMLFormElement) {
	const formData = new FormData(form)
	formData.set("data[attributes][fileType]", fileType.value)

	postAttachmentFetcher.createWithFile(formData)
	.then(({ body }) => {
		attachmentResources.value = [
			...attachmentResources.value,
			body.data
		]
		emitClose()
	}).catch(({ body }) => {
		if (body) {
			const { errors } = body
			receivedErrors.value = errors.map((error: UnitError) => {
				const readableDetail = error.detail

				return readableDetail
			})
		} else {
			receivedErrors.value = [ "an error occured" ]
		}
	})
}

function uploadPostAttachment(event: Event): void {
	const target = event.target as HTMLInputElement
	const files = target.files as FileList
	const file = files.item(0) as File
	const rawFilename = file.name as string

	fileType.value = file.type

	fileSize.value = file.size as number|null
	if (isFileSizeGreaterThanLimit.value) receivedErrors.value.push("Maximum file size is 20mb")

	previewFile.value = file ? URL.createObjectURL(file) : ""
	filename.value = rawFilename

	console.log(file.type)
	const form = target.form as HTMLFormElement
	sendFile(form)
}

function createPost(): void {
	fetcher.create({
		"content": content.value,
		"createdAt": new Date().toJSON(),
		"deletedAt": null,
		"updatedAt": new Date().toJSON()
	}, {
		"extraDataFields": {
			"relationships": {
				"department": {
					"data": {
						"id": departmentID.value,
						"type": "department"
					}
				},
				"postAttachments": {
					"data": attachmentResources.value.map(resource => ({
						"id": resource.id,
						"type": "post_attachment"
					}))
				},
				"poster": {
					"data": {
						"id": userProfile.data.id,
						"type": "user"
					}
				},
				"posterRole": {
					"data": {
						"id": roleID.value,
						"type": "role"
					}
				}
			}
		}
	}).then(() => {
		close()
	}).catch(console.log)
}
</script>
