<template>
	<div class="multiviewer">
		<form>
			<SelectableOptionsField
				v-model="chosenDepartment"
				label="Department"
				class="filter"
				:options="departmentNames"/>
			<SelectableExistence v-model="existence" class="existence"/>
		</form>

		<Suspensible class="viewer-group" :is-loaded="isLoaded">
			<Viewer
				v-for="(post, i) in posts.data"
				:key="post.id"
				v-model="posts.data[i]"
				:comment-count="posts.data[i].meta?.commentCount || 0"
				class="viewer"/>
			<p v-if="hasNoPosts">
				There are no posts found.
			</p>
		</Suspensible>

		<div v-if="hasRemainingPosts" class="load-others">
			<button
				class="btn btn-primary"
				@click="retrievePosts">
				Load other posts
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
@import "@styles/variables.scss";
	.multiviewer {
		@apply flex flex-col;

		form {
			@apply flex flex-row flex-wrap sm:flex flex-col flex-wrap items-stretch;
			@apply bg-gray-300 bg-opacity-20 p-4 mb-4 shadow-inner;

		.filter{
			@apply flex flex-col flex-wrap sm: flex flex-row flex-wrap truncate;
		}

			.existence {
				@apply flex flex-col flex-nowrap;
			}
		}

		.viewer-group {
			@apply flex-1 flex flex-col;

			.viewer {
				@apply flex-1 mb-8;
			}
		}
		.load-others {
			@apply flex-1;
			button { @apply w-[100%]; }
		}
	}
</style>

<script setup lang="ts">
import { ref, computed, watch, inject, Ref, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedPostListDocument } from "$/types/documents/post"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/post"
import debounce from "$@/helpers/debounce"
import isUndefined from "$/type_guards/is_undefined"
import loadRemainingResource from "$@/helpers/load_remaining_resource"

import Viewer from "@/post/multiviewer/viewer.vue"
import Suspensible from "@/helpers/suspensible.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import SelectableExistence from "@/fields/selectable_radio/existence.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps

const props = defineProps<{
	departments: DeserializedDepartmentListDocument,
	modelValue: DeserializedPostListDocument<"poster"|"posterRole"|"department">
}>()

interface CustomEvents {
	(
		event: "update:modelValue",
		post: DeserializedPostListDocument<"poster"|"posterRole"|"department">
	): void
}
const emit = defineEmits<CustomEvents>()

// eslint-disable-next-line no-use-before-define
const debouncedCommentCounting = debounce(countCommentsOfPosts, DEBOUNCED_WAIT_DURATION)

const posts = computed<DeserializedPostListDocument<"poster"|"posterRole"|"department">>({
	get(): DeserializedPostListDocument<"poster"|"posterRole"|"department"> {
		return props.modelValue
	},
	set(newValue: DeserializedPostListDocument<"poster"|"posterRole"|"department">): void {
		if (newValue.data.some(post => isUndefined(post.meta))) {
			debouncedCommentCounting()
		}

		emit("update:modelValue", newValue)
	}
})
const hasNoPosts = computed<boolean>(() => posts.value.data.length === 0)
const hasRemainingPosts = computed<boolean>(
	() => posts.value.data.length < (posts.value.meta?.count || 0)
)

const NULL_AS_STRING = "~"
const departmentNames = computed<OptionInfo[]>(() => [
	{
		"label": "General",
		"value": NULL_AS_STRING
	},
	...props.departments.data.map(data => ({
		"label": data.acronym,
		"value": data.id
	}))
])
const chosenDepartment = ref<string>(userProfile.data.department.data.id)
const existence = ref<string>("exists")
const isLoaded = ref(false)

function extractPostIDsWithNoVoteInfo(
	currentPosts: DeserializedPostListDocument<"poster"|"posterRole"|"department">
): string[] {
	const commentsWithNoVoteInfo = currentPosts.data.filter(comment => isUndefined(comment.meta))
	const commentIDs = commentsWithNoVoteInfo.map(comment => comment.id)
	return commentIDs
}

const fetcher = new Fetcher()
async function countCommentsOfPosts(): Promise<void> {
	const postIDs = extractPostIDsWithNoVoteInfo(posts.value)

	if (postIDs.length === 0) return

	await fetcher.countComments(postIDs)
	.then(response => {
		const deserializedData = response.body.data
		const postsWithVoteInfo = [ ...posts.value.data ]

		for (const identifierData of deserializedData) {
			const { meta, id } = identifierData

			const postWithVoteInfo = postsWithVoteInfo.find(post => post.id === id)

			if (isUndefined(postWithVoteInfo)) {
				throw new Error("Posh requested to load comment info is missing.")
			} else {
				postWithVoteInfo.meta = meta
			}
		}

		posts.value = {
			...posts.value,
			"data": postsWithVoteInfo
		}
	})
}

async function retrievePosts() {
	isLoaded.value = false
	await loadRemainingResource(posts as Ref<DeserializedPostListDocument>, fetcher, () => ({
		"filter": {
			"departmentID": chosenDepartment.value === NULL_AS_STRING ? null : chosenDepartment.value,
			"existence": existence.value as "exists"|"archived"|"*"
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": posts.value.data.length
		},
		"sort": [ "-createdAt" ]
	}), {
		"mayContinue": () => Promise.resolve(false)
	})
	isLoaded.value = true
}

function resetPostList() {
	posts.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	retrievePosts()
}

onMounted(async() => {
	await countCommentsOfPosts()

	watch(
		[ chosenDepartment, existence ],
		debounce(resetPostList, DEBOUNCED_WAIT_DURATION)
	)

	isLoaded.value = true
})
</script>
