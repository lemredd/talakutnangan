<template>
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<SelectableOptionsField
				v-if="mayPostGenerally"
				v-model="chosenDepartment"
				label="Department"
				class="filter department-selector"
				:options="departmentName"/>
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
			</DraftForm>
			<form @submit.prevent>
				<input
					type="hidden"
					name="data[type]"
					value="post_attachment"/>
				<label class="btn btn-primary" for="choose-file-btn">
					Choose file
				</label>
				<input
					id="choose-file-btn"
					type="file"
					name="data[attributes][fileContents]"
					class="hidden"
					accept="*/*"
					@change="uploadPostAttachment"/>
			</form>
			<div v-if="hasExtracted" class="preview-file">
				<div v-if="isFileTypeImage" class="preview-img-container">
					<div class="removable-image relative">
						<span
							class="material-icons close"
							@click="removeFile">
							close
						</span>
						<img class="preview-img" :src="previewFile"/>
					</div>
					<small class="preview-title">
						{{ filename }}
					</small>
				</div>
				<div
					v-else
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
				:disabled="isFileSizeGreaterThanLimit"
				:form="CREATE_POST_FORM_ID"
				class="btn submit-btn btn-primary"
				type="submit">
				Create post
			</button>
		</template>
	</overlay>
</template>


<style scoped lang="scss">
@import "@styles/btn.scss";

.preview-img{
	@apply py-5;
	max-width:100%;
	max-height:100%;
}

.close{
	@apply p-2 bg-black bg-opacity-60 text-white absolute right-0 top-5;
}

.filter{
			@apply flex flex-col flex-wrap;
			max-width:100%;
		}
</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { UnitError } from "$/types/server"
import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { PostRelationships } from "$/types/documents/post"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"
import type { DeserializedPostAttachmentResource } from "$/types/documents/post_attachment"
import { MAXIMUM_FILE_SIZE } from "$/constants/measurement"

import Fetcher from "$@/fetchers/post"
import assignPath from "$@/external/assign_path"
import specializePath from "$/helpers/specialize_path"
import { READ_POST } from "$/constants/template_page_paths"
import PostAttachmentFetcher from "$@/fetchers/post_attachment"
import { post as permissionGroup } from "$/permissions/permission_list"
import { CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT } from "$/permissions/post_combinations"

import Overlay from "@/helpers/overlay.vue"
import DraftForm from "@/post/draft_form.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps

const CREATE_POST_FORM_ID = "create-post"
const fetcher = new Fetcher()
const postAttachmentFetcher = new PostAttachmentFetcher()
const chosenDepartment = ref<string>(userProfile.data.department.data.id)

const hasMultipleRoles = userProfile.data.roles.data.length > 1
const roleNames = computed<OptionInfo[]>(() => userProfile.data.roles.data.map(data => ({
	"label": data.name,
	"value": data.id
})))
const roleID = ref<string>(userProfile.data.roles.data[0].id)

const props = defineProps<{
	isShown: boolean
	departments: DeserializedDepartmentListDocument
}>()

const NULL_AS_STRING = "~"
const departmentName = computed<OptionInfo[]>(() => [
	{
		"label": "General",
		"value": NULL_AS_STRING
	},
	...props.departments.data.map(data => ({
		"label": data.fullName,
		"value": data.id
	}))
])

const mayPostGenerally = computed<boolean>(() => {
	const isLimitedUpToGlobalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
	])
	return isLimitedUpToGlobalScope && props.departments.data.length > 1
})

const content = ref<string>("")

interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()

const filename = ref<string|null>(null)
const hasExtracted = computed<boolean>(() => filename.value !== null)
const previewFile = ref<any>(null)
const extractedFileType = ref("")
const isFileTypeImage = computed(() => extractedFileType.value.includes("image"))
const fileSize = ref<number|null>(null)
const isFileSizeGreaterThanLimit = computed(() => {
	const castedFileSize = fileSize.value as number
	return castedFileSize > MAXIMUM_FILE_SIZE
})
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
	formData.set("data[attributes][fileType]", extractedFileType.value)

	postAttachmentFetcher.createWithFile(formData)
	.then(({ body }) => {
		attachmentResources.value = [
			...attachmentResources.value,
			body.data
		]
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
	const file = target.files?.item(0)
	const rawFilename = file?.name as ""

	fileSize.value = file?.size as number|null
	if (isFileSizeGreaterThanLimit.value) receivedErrors.value.push("Maximum file size is 20mb")
	previewFile.value = file ? URL.createObjectURL(file) : ""
	extractedFileType.value = file?.type as string
	filename.value = rawFilename

	const form = target.form as HTMLFormElement
	sendFile(form)
}

function createPost(): void {
	const attachmentIDs = attachmentResources.value.map(resource => ({
		"id": resource.id,
		"type": "post_attachment"
	}))
	const postAttachments = attachmentIDs.length === 0
		// eslint-disable-next-line no-undefined
		? undefined
		: {
			"data": attachmentIDs
		}
	const department = chosenDepartment.value === NULL_AS_STRING
		// eslint-disable-next-line no-undefined
		? undefined
		: {
			"data": {
				"id": chosenDepartment.value,
				"type": "department"
			}
		}

	fetcher.create({
		"content": content.value,
		"createdAt": new Date().toJSON(),
		"deletedAt": null,
		"updatedAt": new Date().toJSON()
	}, {
		"extraDataFields": {
			"relationships": {
				department,
				postAttachments,
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
		} as PostRelationships<"create">
	}).then(({ body }) => {
		const { data } = body
		assignPath(
			specializePath(READ_POST, {
				"id": data.id
			})
		)
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

</script>
