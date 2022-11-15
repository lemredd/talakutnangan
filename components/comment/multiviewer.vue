<template>
	<div class="multiviewer">
		<SelectableExistenceFilter
			v-if="mayViewArchivedOrRestore"
			v-model="existence"
			class="comment-existence-filter"/>
		<Viewer
			v-for="(comment, i) in comments.data"
			:key="comment.id"
			v-model="comments.data[i]"
			class="viewer"
			@archive="archiveComment"
			@restore="restoreComment"/>
		<Suspensible :is-loaded="isLoaded">
			<p v-if="hasNoComments">
				There are no comments found.
			</p>
			<div v-if="hasRemainingComments" class="load-others">
				<button
					class="load-btn btn btn-secondary"
					@click="fetchComments">
					Load other comments
				</button>
			</div>
		</Suspensible>
	</div>
</template>

<style lang="scss">
	@import "@styles/btn.scss";
	@import "@styles/variables.scss";
	.multiviewer {
		@apply flex flex-col flex-nowrap justify-start items-stretch;

		.comment-existence-filter {
			@apply sm:mt-12 mb-4;
		}

		.viewer {
			@apply flex-1;
		}

		.load-others {
			@apply flex-1;

			button {
				width: 100%;
			}
		}
	}
</style>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"
import type {
	DeserializedCommentListDocument,
	DeserializedCommentResource
} from "$/types/documents/comment"

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
	mayViewArchivedOrRestore: boolean
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
const hasRemainingComments = computed<boolean>(
	() => comments.value.data.length < (comments.value.meta?.count || 0)
)

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
const hasNoComments = computed(() => comments.value.data.length === 0)

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
			"mayContinue": () => Promise.resolve(false)
		}
	)

	isLoaded.value = true
}

function removeComment(commentToRemove: DeserializedCommentResource<"user">, increment: number) {
	comments.value = {
		...comments.value,
		"data": comments.value.data.filter(comment => comment.id !== commentToRemove.id),
		"meta": {
			...comments.value.meta,
			"count": Math.max((comments.value.meta?.count ?? 0) + increment, 0)
		}
	}
}

function archiveComment(commentToRemove: DeserializedCommentResource<"user">) {
	removeComment(commentToRemove, -1)
}

function restoreComment(commentToRemove: DeserializedCommentResource<"user">) {
	removeComment(commentToRemove, -1)
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

	isLoaded.value = true
})
</script>
