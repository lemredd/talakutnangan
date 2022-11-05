<template>
	<div class="multiviewer">
		<Viewer
			v-for="(comment, i) in comments"
			:key="comment.id"
			v-model="comments[i]"
			class="viewer"/>
	</div>
</template>

<style lang="scss">
	.multiviewer {
		@apply flex flex-col flex-nowrap justify-start items-stretch;

		.viewer {
			@apply flex-1;
		}
	}
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

const fetcher = new Fetcher()

const comments = computed<DeserializedCommentResource<"user">[]>({
	get(): DeserializedCommentResource<"user">[] {
		return props.modelValue
	},
	set(newValue: DeserializedCommentResource<"user">[]): void {
		if (newValue.some(comment => isUndefined(comment.meta))) {
			// eslint-disable-next-line no-use-before-define
			countVotesOfComments(extractCommentIDsWithNoVoteInfo(newValue))
		} else {
			emit("update:modelValue", newValue)
		}
	}
})

function extractCommentIDsWithNoVoteInfo(currentComments: DeserializedCommentResource<"user">[])
: string[] {
	const commentsWithNoVoteInfo = currentComments.filter(comment => isUndefined(comment.meta))
	const commentIDs = commentsWithNoVoteInfo.map(comment => comment.id)
	return commentIDs
}

async function countVotesOfComments(commentIDs: string[]): Promise<void> {
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

async function countCommentVote(): Promise<number|void> {
	await countVotesOfComments(extractCommentIDsWithNoVoteInfo(comments.value))
}

onMounted(async() => await countCommentVote())
</script>
