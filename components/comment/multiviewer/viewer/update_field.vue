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
import type { DeserializedCommentResource } from "$/types/documents/comment"

import Fetcher from "$@/fetchers/comment"

import Field from "@/comment/field.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">

interface CustomEvents {
	(event: "update:modelValue", data: DeserializedCommentResource<"user">): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	modelValue: DeserializedCommentResource
}>()

const { pageProps } = pageContext
const { userProfile } = pageProps
const comment = computed<DeserializedCommentResource>(
	() => props.modelValue as DeserializedCommentResource
)

const content = ref<string>(props.modelValue.content)
const commentStatus = ref<FieldStatus>("enabled")

const fetcher = new Fetcher()
async function submit() {
	await fetcher.update(comment.value.id, {
		"approvedAt": null,
		"content": content.value,
		"createdAt": new Date().toJSON(),
		"deletedAt": null,
		"updatedAt": new Date().toJSON()
	}).then(() => {
		content.value = ""
		emit("update:modelValue", {
			...comment.value,
			"content": content.value
		} as DeserializedCommentResource<"user">)
	})
}
</script>
