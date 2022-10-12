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
import { ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { PostResource } from "$/types/documents/post"
import type {
	DeserializedPostAttachmentResource,
	PostAttachmentIdentifierListDocument
} from "$/types/documents/post_attachment"

import Fetcher from "$@/fetchers/post"
import PostAttachmentFetcher from "$@/fetchers/post_attachment"

type RequiredExtraProps = "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const CREATE_POST_FORM_ID = "create-post"
const fetcher = new Fetcher()
const postAttachmentFetcher = new PostAttachmentFetcher()

const { isShown } = defineProps<{ isShown: boolean }>()

const roleID = ref("")
const post = ref<PostResource<"create">>({
	"attributes": {
		"content": "",
		"deletedAt": null
	},
	"id": 0 as unknown as undefined,
	"relationships": {
		"department": {
			"data": {
				"id": userProfile.data.department.data.id,
				"type": "department"
			}
		},
		"postAttachments": {
			"data": []
		} as PostAttachmentIdentifierListDocument,
		"poster": {
			"data": {
				"id": userProfile.data.id,
				"type": "user"
			}
		},
		"posterRole": {
			"data": {
				"id": userProfile.data.roles.data[0].id,
				"type": "role"
			}
		}
	},
	"type": "post"
})
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
	fetcher.create(post.value.attributes, {
		"extraCreateDocumentProps": {
			"relationships": {
				...post.value.relationships,
				"postAttachments": {
					"data": attachmentResources.value.map(resource => ({
						"id": resource.id,
						"type": "post_attachment"
					}))
				}
			}
		}
	}).then(() => {
		close()
	}).catch(console.log)
}
</script>
