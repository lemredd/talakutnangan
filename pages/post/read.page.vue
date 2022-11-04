<template>
	<article>
		<Viewer
			v-model="post"
			:comment-count="commentCount"/>
		<div class="comments">
			<SelectableCommentExistenceFilter
				v-if="isPostOwned"
				v-model="commentExistence"/>
			<CreateCommentField
				v-if="mayCreateComment"
				class="field"
				:post="post"
				@create-comment="includeComment"/>
			<Multiviewer v-model="comments"/>
		</div>
	</article>
</template>

<style lang="scss">
	article {
		@apply flex flex-col flex-nowrap justify-center;

		> .comments {
			@apply flex-1 flex-col flex-nowrap;
			@apply p-5 bg-light-800 shadow-lg rounded-[1rem];
		}

		> * {
			@apply mb-4;
		}
	}
</style>

<script setup lang="ts">
import { inject, ref, watch, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import CommentFetcher from "$@/fetchers/comment"

import Viewer from "@/post/multiviewer/viewer.vue"
import Multiviewer from "@/comment/multiviewer.vue"
import CreateCommentField from "@/comment/create_field.vue"
import SelectableCommentExistenceFilter from "@/fields/selectable_radio/existence.vue"

type RequiredExtraProps =
	| "userProfile"
	| "post"
	| "comments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const post = ref<DeserializedPostResource<"poster"|"posterRole"|"department">>(
	pageProps.post.data as DeserializedPostResource<"poster"|"posterRole"|"department">
)
const isPostOwned = post.value.poster.data.id === userProfile.data.id

const comments = ref<DeserializedCommentResource<"user">[]>(
	pageProps.comments.data as DeserializedCommentResource<"user">[]
)
const commentCount = computed<number>(() => {
	const castMeta = pageProps.comments.meta as ResourceCount

	return castMeta.count
})
const mayCreateComment = computed<boolean>(() => {
	const isPostPublic = !post.value.department
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
	])

	const isLimitedUpToDepartmentScope = !isLimitedPersonalScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT
		])

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
		])

	const isPermitted = isPostPublic
	|| isLimitedPersonalScope
	|| isLimitedUpToDepartmentScope
	|| isLimitedUpToGlobalScope

	return isPermitted && post.value.deletedAt === null
})
function includeComment(newComment: DeserializedCommentResource<"user">): void {
	comments.value.push(newComment)
}
const commentFetcher = new CommentFetcher()

async function fetchComments() {
	await commentFetcher.list({
		"filter": {
			"existence": commentExistence.value,
			"postID": post.value.id
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": 0
		},
		"sort": [ "-createdAt" ]
	})
	.then(({ body }) => {
		const { data } = body

		if (data.length === 0) return Promise.resolve()
		comments.value = data as DeserializedCommentResource<"user">[]

		return Promise.resolve()
	})
}
const commentExistence = ref<"exists"|"archived"|"*">("exists")
watch(commentExistence, () => fetchComments())
</script>
