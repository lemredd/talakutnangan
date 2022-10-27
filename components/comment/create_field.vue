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
	post: DeserializedPostResource
}>()

const { pageProps } = pageContext
const { userProfile } = pageProps
const post = computed<DeserializedPostResource>(
	() => props.post as DeserializedPostResource
)

const content = ref<string>("")
const commentStatus = ref<FieldStatus>("loaded")

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
		commentStatus.value = "loaded"
		content.value = ""
		emit("createComment", {
			...body.data,
			"post": {
				"data": post.value
			},
			"user": userProfile as DeserializedUserDocument
		} as DeserializedCommentResource<"user">)
	})
}
</script>
