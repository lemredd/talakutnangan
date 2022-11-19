<template>
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<DraftForm
				:id="postID"
				v-model="content"
				@submit-post="updatePost">
				<div v-if="hasMultipleRoles" class="role-selector flex mt-1">
					<SelectableOptionsField
						v-model="roleID"
						label="Post as: "
						placeholder="Choose the role"
						:options="roleNames"/>
				</div>
				<SearchableChip
					v-model:model-value="tags"
					header="Optional tags"
					:maximum-tags="MAX_TAGS"
					text-field-label="Type the tags to add"/>
				<Suspensible :is-loaded="hasUpdatedTags">
					<button
						type="button"
						class="btn btn-primary"
						@click="updateTags">
						Update tags
					</button>
				</Suspensible>
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
			<div v-if="hasExistingAttachments">
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
						<small class="preview-title">
							Attachment {{ attachment.id }}
						</small>
					</div>
					<div
						v-else
						class="preview-file-container">
						<span class="material-icons mr-2">
							attachment
						</span>
						<small class="preview-file-title">
							Attachment {{ filename }}
						</small>
						<span
							class="remove-file-btn material-icons cursor-pointer"
							@click="removeFile">
							close
						</span>
					</div>
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
				:form="postID"
				class="btn submit-btn btn-primary"
				type="button"
				@click="updatePost">
				Update post
			</button>
		</template>
	</Overlay>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.optional-tags {
		@apply mt-5 mb-5;
	}

	.btn {
		@apply mb-5;
	}
	.preview-img{
		@apply py-5;
		max-width:100%;
		max-height:100%;
	}

	.close{
		@apply p-2 bg-black bg-opacity-60 text-white absolute right-0 top-5;
	}
</style>

<script setup lang="ts">
import { computed, ref, watch } from "vue"

import type { OptionInfo } from "$@/types/component"
import type { DeserializedTagResource } from "$/types/documents/tag"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedPostAttachmentResource } from "$/types/documents/post_attachment"

import { MAX_TAGS } from "$/constants/numerical"
import { MAXIMUM_FILE_SIZE } from "$/constants/measurement"
import { READ_POST } from "$/constants/template_page_paths"

import Fetcher from "$@/fetchers/post"
import UserFetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"
import isUndefined from "$/type_guards/is_undefined"
import specializePath from "$/helpers/specialize_path"
import PostAttachmentFetcher from "$@/fetchers/post_attachment"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import Overlay from "@/helpers/overlay.vue"
import DraftForm from "@/post/draft_form.vue"
import SearchableChip from "@/post/searchable_chip.vue"
import Suspensible from "@/helpers/suspensible.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"

const userFetcher = new UserFetcher()

type AssociatedPostResource = "poster"|"posterRole"|"department"|"postAttachments"
const props = defineProps<{
	isShown: boolean,
	modelValue: DeserializedPostResource<AssociatedPostResource>
}>()

interface CustomEvents {
	(event: "close"): void,
	(event: "submit"): void,
	(
		event: "update:modelValue",
		content: DeserializedPostResource<AssociatedPostResource>
	): void
}
const emit = defineEmits<CustomEvents>()

const hasExistingAttachments = computed<boolean>(() => {
	const hasAttachments = !isUndefined(props.modelValue.postAttachments)

	return hasAttachments
})
const postAttachments = ref<DeserializedPostAttachmentResource[]>(
	props.modelValue.postAttachments.data
)

const isShown = computed<boolean>(() => props.isShown)
const hasLoadedCompletePosterInfo = computed<boolean>(() => {
	const hasRoles = Boolean(props.modelValue.poster.data.roles)
	return hasRoles
})

const hasMultipleRoles = computed(() => {
	if (hasLoadedCompletePosterInfo.value) {
		const completePosterInfo = props.modelValue.poster as DeserializedUserDocument<"roles">

		return completePosterInfo.data.roles.data.length
	}

	return false
})
const roleNames = computed<OptionInfo[]>(() => {
	if (hasMultipleRoles.value) {
		const completePosterInfo = props.modelValue.poster as DeserializedUserDocument<"roles">

		return completePosterInfo.data.roles.data.map(data => ({
			"label": data.name,
			"value": data.id
		}))
	}

	return []
})
const roleID = computed<string>({
	get(): string {
		return props.modelValue.posterRole.data.id
	},
	set(newValue: string): void {
		let currentRole = props.modelValue.posterRole.data

		if (hasMultipleRoles.value) {
			const completePosterInfo = props.modelValue.poster as DeserializedUserDocument<"roles">

			currentRole = completePosterInfo.data.roles.data.find(
				data => data.id === newValue
			) as DeserializedRoleResource<"read">
		}

		emit("update:modelValue", {
			...props.modelValue,
			"posterRole": {
				"data": currentRole
			}
		})
	}
})

const postID = computed<string>(() => props.modelValue.id)
const tags = ref<DeserializedTagResource[]>([
	{
		"deletedAt": null,
		"id": null
	}
])
const content = computed<string>({
	get(): string {
		return props.modelValue.content
	},
	set(newValue: string): void {
		emit("update:modelValue", {
			...props.modelValue,
			"content": newValue
		})
	}
})

const fetcher = new Fetcher()
const postAttachmentFetcher = new PostAttachmentFetcher()

function isImage(type: string): boolean {
	return type.includes("image")
}

const filename = ref<string|null>(null)
const previewFile = ref<any>(null)
const extractedFileType = ref("")
const fileSize = ref<number|null>(null)
const isFileSizeGreaterThanLimit = computed(() => {
	const castedFileSize = fileSize.value as number
	return castedFileSize > MAXIMUM_FILE_SIZE
})
const receivedErrors = ref<string[]>([])

function removeFile(id: string) {
	postAttachmentFetcher.archive(
		[ id ]
	)
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
	formData.set("data[relationships][post][data][id]", postID.value)
	formData.set("data[relationships][post][data][type]", "post")
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

function updatePost(): void {
	fetcher.update(postID.value, {
		"content": content.value,
		"createdAt": new Date().toJSON(),
		"deletedAt": null,
		"updatedAt": new Date().toJSON()
	}, {
	})
	.then(() => {
		assignPath(
			specializePath(READ_POST, {
				"id": Number(postID.value)
			})
		)
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors))
}

const hasUpdatedTags = ref<boolean>(true)
function updateTags() {
	hasUpdatedTags.value = false
	// Add code to update the tags
	hasUpdatedTags.value = true
}

watch(isShown, newValue => {
	if (newValue && !hasLoadedCompletePosterInfo.value) {
		userFetcher.read(props.modelValue.poster.data.id).then(({ body }) => {
			emit("update:modelValue", {
				...props.modelValue,
				"poster": body
			})
		})
	}
})
</script>
