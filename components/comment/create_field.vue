<template>
	<Field
		v-model="content"
		v-model:status="commentStatus"
		:user="userProfile"
		@submit-comment="submit"/>
</template>

<style lang="scss">

</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import Fetcher from "$@/fetchers/comment"

import Field from "@/comment/field.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">

interface CustomEvents {
	(event: "createComment", data: DeserializedCommentResource<"user">): void
	(event: "submitPost"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	postToInsertComment: DeserializedPostResource
}>()

const { pageProps } = pageContext
const { userProfile } = pageProps
const postToInsertComment = computed<DeserializedPostResource>(
	() => props.postToInsertComment as DeserializedPostResource
)

const content = ref<string>("")
const commentStatus = ref<FieldStatus>("enabled")

const fetcher = new Fetcher()
async function submit() {
	await fetcher.create({
		"approvedAt": null,
		"content": content.value,
		"createdAt": new Date().toJSON(),
		"deletedAt": null,
		"updatedAt": new Date().toJSON()
	}, {
		"extraDataFields": {
			"relationships": {
				// eslint-disable-next-line no-undefined
				"comments": undefined,
				"post": {
					"data": {
						"id": postToInsertComment.value.id,
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
		content.value = ""
		emit("createComment", {
			...body.data,
			"post": {
				"data": postToInsertComment.value
			},
			"user": userProfile as DeserializedUserDocument
		} as DeserializedCommentResource<"user">)
	})
}
</script>
