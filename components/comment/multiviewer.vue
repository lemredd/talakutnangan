<template>
	<div class="multiviewer">
		<SelectableCommentExistenceFilter
			v-if="isPostOwned"
			v-model="existence"/>
		<Viewer
			v-for="(comment, i) in comments.data"
			:key="comment.id"
			v-model="comments.data[i]"/>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from "vue"

import type { DeserializedCommentListDocument } from "$/types/documents/comment"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/comment"
import isUndefined from "$/type_guards/is_undefined"

import loadRemainingResource from "$@/helpers/load_remaining_resource"

import Viewer from "@/comment/multiviewer/viewer.vue"
import SelectableCommentExistenceFilter from "@/fields/selectable_radio/existence.vue"


const props = defineProps<{
	isPostOwned: boolean
	modelValue: DeserializedCommentListDocument<"user">
	postId: string
}>()

interface CustomEvents {
	(
		event: "update:modelValue",
		comment: DeserializedCommentListDocument<"user">
	): void
}
const emit = defineEmits<CustomEvents>()

const fetcher = new Fetcher()

const comments = computed<DeserializedCommentListDocument<"user">>({
	get(): DeserializedCommentListDocument<"user"> {
		return props.modelValue
	},
	set(newValue: DeserializedCommentListDocument<"user">): void {
		if (newValue.data.some(comment => isUndefined(comment.meta))) {
			// eslint-disable-next-line no-use-before-define
			countVotesOfComments(extractCommentIDsWithNoVoteInfo(newValue))
		} else {
			emit("update:modelValue", newValue)
		}
	}
})

function extractCommentIDsWithNoVoteInfo(currentComments: DeserializedCommentListDocument<"user">)
: string[] {
	const commentsWithNoVoteInfo = currentComments.data.filter(comment => isUndefined(comment.meta))
	const commentIDs = commentsWithNoVoteInfo.map(comment => comment.id)
	return commentIDs
}

async function countVotesOfComments(commentIDs: string[]): Promise<void> {
	await fetcher.countVotes(commentIDs)
	.then(response => {
		const deserializedData = response.body.data
		const commentsWithVoteInfo = [ ...comments.value.data ]

		for (const identifierData of deserializedData) {
			const { meta, id } = identifierData

			const commentWithVoteInfo = commentsWithVoteInfo.find(comment => comment.id === id)

			if (isUndefined(commentWithVoteInfo)) {
				throw new Error("Comment requested to load vote info is missing.")
			} else {
				commentWithVoteInfo.meta = meta
			}
		}

		comments.value = {
			...comments.value,
			"data": commentsWithVoteInfo
		}
	})
}

async function countCommentVote(): Promise<number|void> {
	await countVotesOfComments(extractCommentIDsWithNoVoteInfo(comments.value))
}


const existence = ref<"exists"|"archived"|"*">("exists")
async function fetchComments() {
	const { postId } = props
	await loadRemainingResource(
		comments as Ref<DeserializedCommentListDocument>,
		fetcher,
		() => ({
			"filter": {
				"existence": existence.value,
				"postID": postId
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": comments.value.data.length
			},
			"sort": [ "-createdAt" ]
		})
	)
}

watch(existence, () => fetchComments())

onMounted(async() => await countCommentVote())
</script>
