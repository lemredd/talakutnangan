<template>
	<div class="multiviewer">
		<SelectableExistenceFilter
			v-if="isPostOwned"
			v-model="existence"/>
		<Suspensible :is-loaded="isLoaded">
			<Viewer
				v-for="(comment, i) in comments.data"
				:key="comment.id"
				v-model="comments.data[i]"/>
		</Suspensible>
	</div>
</template>

<style scoped lang="scss">
	.multiviewer {
		@apply flex-1 flex flex-col flex-nowrap justify-start items-center;
	}
</style>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch, nextTick } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedCommentListDocument } from "$/types/documents/comment"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/comment"
import debounce from "$@/helpers/debounce"
import isUndefined from "$/type_guards/is_undefined"
import loadRemainingResource from "$@/helpers/load_remaining_resource"

import Suspensible from "@/helpers/suspensible.vue"
import Viewer from "@/comment/multiviewer/viewer.vue"
import SelectableExistenceFilter from "@/fields/selectable_radio/existence.vue"

const props = defineProps<{
	isPostOwned: boolean
	modelValue: DeserializedCommentListDocument<"user">
	post: DeserializedPostResource
}>()

interface CustomEvents {
	(
		event: "update:modelValue",
		comment: DeserializedCommentListDocument<"user">
	): void
}
const emit = defineEmits<CustomEvents>()

// eslint-disable-next-line no-use-before-define
const debouncedVoteCounting = debounce(countVotesOfComments, DEBOUNCED_WAIT_DURATION)

const comments = computed<DeserializedCommentListDocument<"user">>({
	get(): DeserializedCommentListDocument<"user"> {
		return props.modelValue
	},
	set(newValue: DeserializedCommentListDocument<"user">): void {
		if (newValue.data.some(comment => isUndefined(comment.meta))) {
			debouncedVoteCounting()
		}

		emit("update:modelValue", newValue)
	}
})

function extractCommentIDsWithNoVoteInfo(currentComments: DeserializedCommentListDocument<"user">)
: string[] {
	const commentsWithNoVoteInfo = currentComments.data.filter(comment => isUndefined(comment.meta))
	const commentIDs = commentsWithNoVoteInfo.map(comment => comment.id)
	return commentIDs
}

const fetcher = new Fetcher()
async function countVotesOfComments(): Promise<void> {
	const commentIDs = extractCommentIDsWithNoVoteInfo(comments.value)

	if (commentIDs.length === 0) return

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

const existence = ref<"exists"|"archived"|"*">("exists")
const isLoaded = ref(false)

async function fetchComments() {
	isLoaded.value = false
	const { id } = props.post
	await loadRemainingResource(
		comments as Ref<DeserializedCommentListDocument>,
		fetcher,
		() => ({
			"filter": {
				"existence": existence.value,
				"postID": id
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": comments.value.data.length
			},
			"sort": [ "-createdAt" ]
		}),
		{
			"mayContinue": () => Promise.resolve(false),
			postOperations() {
				isLoaded.value = true
				return Promise.resolve()
			}
		}
	)
}

function resetCommentsList() {
	comments.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}

	fetchComments()
}

onMounted(async() => {
	await countVotesOfComments()

	watch(existence, debounce(resetCommentsList, DEBOUNCED_WAIT_DURATION))
})
</script>
