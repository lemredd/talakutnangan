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
				<SearchableChip
					v-model="tags"
					class="optional-tags"
					header="Optional tags"
					:maximum-tags="MAX_TAGS"
					text-field-label="Type the tags to add"/>
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
			<div
				v-for="attachment in postAttachments"
				:key="attachment.id"
				class="preview-file">
				<div v-if="isImage(attachment.fileType)" class="preview-img-container">
					<div class="removable-image relative">
						<span
							class="material-icons close"
							@click="removeFile(attachment.id)">
							close
						</span>
						<img class="preview-img" :src="attachment.fileContents"/>
					</div>
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
						@click="removeFile(attachment.id)">
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

	.optional-tags {
		@apply mt-5 mb-5;
	}

	.preview-img {
		@apply py-5;
		max-width:100%;
		max-height:100%;
	}

	.close {
		@apply p-2 bg-black bg-opacity-60 text-white absolute right-0 top-5;
	}

	.filter {
		@apply flex flex-col flex-wrap;
		max-width:100%;
	}
</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { PostRelationships } from "$/types/documents/post"
import type { DeserializedTagResource } from "$/types/documents/tag"
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
import SearchableChip from "@/post/searchable_chip.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps

const MAX_TAGS = 5
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
		"label": data.acronym,
		"value": data.id
	}))
])

const mayPostGenerally = computed<boolean>(() => {
	const isLimitedUpToGlobalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
	])
	return isLimitedUpToGlobalScope && props.departments.data.length > 1
})
const tags = ref<DeserializedTagResource[]>([])

const content = ref<string>("")

interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()

const filename = ref<string|null>(null)
const previewFile = ref<any>(null)
const extractedFileType = ref("")
function isImage(type: string): boolean {
	return type.includes("image")
}

const fileSize = ref<number|null>(null)
const isFileSizeGreaterThanLimit = computed(() => {
	const castedFileSize = fileSize.value as number
	return castedFileSize > MAXIMUM_FILE_SIZE
})
const receivedErrors = ref<string[]>([])
const postAttachments = ref<DeserializedPostAttachmentResource[]>([])

function removeFile(id: string) {
	postAttachmentFetcher.archive([ id ])
	.then(() => {
		postAttachments.value = postAttachments.value.filter(
			postAttachment => postAttachment.id !== id
		)
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors))
}
function emitClose() {
	emit("close")
}

function sendFile(form: HTMLFormElement) {
	const formData = new FormData(form)
	formData.set("data[attributes][fileType]", extractedFileType.value)

	postAttachmentFetcher.createWithFile(formData)
	.then(({ body }) => {
		postAttachments.value = [
			...postAttachments.value,
			body.data
		]
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors))
}

function uploadPostAttachment(event: Event): void {
	const target = event.target as HTMLInputElement
	const file = target.files?.item(0)
	const rawFilename = file?.name as ""

	fileSize.value = file?.size as number|null
	if (isFileSizeGreaterThanLimit.value) {
		receivedErrors.value.push("Maximum file size is 20mb")
	} else {
		previewFile.value = file ? URL.createObjectURL(file) : ""
		extractedFileType.value = file?.type as string
		filename.value = rawFilename
	}


	const form = target.form as HTMLFormElement
	sendFile(form)
}

function createPost(): void {
	const attachmentIDs = postAttachments.value.map(resource => ({
		"id": resource.id,
		"type": "post_attachment"
	}))
	const postAttachmentList = attachmentIDs.length === 0
		// eslint-disable-next-line no-undefined
		? undefined
		: {
			"data": attachmentIDs
		}

	const tagIDs = tags.value.map(resource => ({
		"id": resource.id,
		"type": "tag"
	}))
	const tagList = tags.value.length === 0
	// eslint-disable-next-line no-undefined
		? undefined
		: {
			"data": tagIDs
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
				"postAttachments": postAttachmentList,
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
				},
				"tags": tagList
			}
		} as PostRelationships<"create">
	}).then(({ body }) => {
		const { data } = body
		assignPath(
			specializePath(READ_POST, {
				"id": data.id
			})
		)
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors))
}

</script>
