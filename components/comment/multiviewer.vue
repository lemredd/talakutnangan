<template>
	<div
		v-for="(comment, i) in comments"
		:key="comment.id"
		class="comment">
		<Viewer v-model="comments[i]"/>
		<br/>
	</div>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { computed, onMounted } from "vue"

import type { DeserializedCommentResource } from "$/types/documents/comment"

import Fetcher from "$@/fetchers/comment"
import isUndefined from "$/type_guards/is_undefined"

import Viewer from "@/comment/multiviewer/viewer.vue"

const props = defineProps<{
	modelValue: DeserializedCommentResource<"user">[]
}>()

interface CustomEvents {
	(
		event: "update:modelValue",
		comment: DeserializedCommentResource<"user">[]
	): void
}
const emit = defineEmits<CustomEvents>()

const comments = computed<DeserializedCommentResource<"user">[]>({
	get(): DeserializedCommentResource<"user">[] {
		return props.modelValue
	},
	set(newValue: DeserializedCommentResource<"user">[]): void {
		emit("update:modelValue", newValue)
	}
})

const fetcher = new Fetcher()

async function countCommentVote(): Promise<number|void> {
	const commentsWithNoVoteInfo = comments.value.filter(comment => isUndefined(comment.meta))
	const commentIDs = commentsWithNoVoteInfo.map(comment => comment.id)
	await fetcher.countVotes(commentIDs)
	.then(response => {
		const deserializedData = response.body.data
		const commentsWithVoteInfo = [ ...comments.value ]

		for (const identifierData of deserializedData) {
			const { meta, id } = identifierData

			const commentWithVoteInfo = commentsWithVoteInfo.find(comment => comment.id === id)

			if (isUndefined(commentWithVoteInfo)) {
				throw new Error("Comment requested to load vote info is missing.")
			} else {
				commentWithVoteInfo.meta = meta
			}
		}

		comments.value = commentsWithVoteInfo
	})
}

onMounted(() => countCommentVote())
</script>
