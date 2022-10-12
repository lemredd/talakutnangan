<template>
	<Overlay :is-shown="isShown" @close="close">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<DraftForm
				v-model="post"
				@submit-post="createPost"/>
			<input type="file" @change="uploadPostAttachment"/>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="close">
				Back
			</button>
			<button
				class="btn submit-btn btn-primary"
				:form="CREATE_POST_FORM_ID"
				type="button">
				Create post
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref } from "vue"

import type { DeserializedPostAttachmentResource } from "$/types/documents/post_attachment"

import Fetcher from "$@/fetchers/post"
import PostAttachmentFetcher from "$@/fetchers/post_attachment"

const CREATE_POST_FORM_ID = "create-post"
const fetcher = new Fetcher()
const postAttachmentFetcher = new PostAttachmentFetcher()

const { isShown } = defineProps<{ isShown: boolean }>()

const roleID = ref("")
const post = ref("")
const attachmentResources = ref<DeserializedPostAttachmentResource[]>([])

interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()

function close() {
	emit("close")
}

function uploadPostAttachment(event: Event): void {
	const target = event.target as HTMLInputElement
	const files = target.files as FileList
	const fileCount = files.length
	const latestSelectedFile = files.item(fileCount - 1) as File
	const formData = new FormData()
	formData.set("data[attributes][fileContent]", latestSelectedFile)
	formData.set("data[attributes][fileType]", latestSelectedFile.type)
	formData.set("data[type]", "post_attachment")

	postAttachmentFetcher.createWithFile(formData).then(({ body }) => {
		const { data } = body
		attachmentResources.value.push(data)
	})
}

function createPost(): void {
	fetcher.create({
		"content": content.value,
		"deletedAt": null
	}, {
		"extraCreateDocumentProps": {
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
						"id": userID.value,
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
