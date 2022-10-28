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
	await fetcher.countVotes(comments.value.map(comment => comment.id))
	.then(response => {
		const deserializedData = response.body.data
		for (const identifierData of deserializedData) {
			const { upvoteCount, downvoteCount } = identifierData
			voteCount.value += Number(upvoteCount) - Number(downvoteCount)
		}
	})
}

onMounted(() => countCommentVote())
</script>
