<template>
	<div>
		<TextualField
			v-model="content"
			type="text"
			:may-save-implicitly="true"
			@save-implicitly="submit"/>
		<button class="send-btn material-icons" @click="submit">
			send
		</button>
	</div>
</template>

<style lang="scss">

</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import Fetcher from "$@/fetchers/comment"
import isUndefined from "$/type_guards/is_undefined"

import TextualField from "@/fields/non-sensitive_text.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">

interface CustomEvents {
	(event: "createComment", data: DeserializedCommentResource): void
	(event: "submitPost"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	parentComment?: DeserializedCommentResource,
	post: DeserializedPostResource
}>()

const { pageProps } = pageContext
const { userProfile } = pageProps
const post = computed<DeserializedPostResource>(
	() => props.post as DeserializedPostResource
)
const parentComment = computed<DeserializedCommentResource|undefined>(
	() => props.parentComment as DeserializedCommentResource|undefined
)

const content = ref<string>("")

const fetcher = new Fetcher()
async function submit() {
	await fetcher.create({
		"approvedAt": null,
		"content": content.value,
		"deletedAt": null
	}, {
		"extraDataFields": {
			"relationships": {
				// eslint-disable-next-line no-undefined
				"comments": undefined,
				"parentComment": isUndefined(parentComment.value)
					// eslint-disable-next-line no-undefined
					? undefined
					: {
						"data": {
							"id": parentComment.value.id,
							"type": "comment"
						}
					},
				"post": {
					"data": {
						"id": post.value.id,
						"type": "post"
					}
				},
				"user": {
					"data": {
						"id": userProfile.data.id,
						"type": "user"
					}
				}
			}
		}
	}).then(({ body }) => {
		emit("createComment", {
			...body.data,
			"parentComment": isUndefined(parentComment.value)
				// eslint-disable-next-line no-undefined
				? undefined
				: {
					"data": parentComment.value
				},
			"post": {
				"data": post.value
			},
			"user": userProfile as DeserializedUserDocument
		} as DeserializedCommentResource)
	})
}
</script>
