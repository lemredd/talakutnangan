<template>
	<article>
		<Viewer
			v-model="post"
			:comment-count="commentCount"/>
		<div class="comments">
			<CreateCommentField
				v-if="mayCreateComment"
				class="field"
				:post="post"
				@create-comment="includeComment"/>
			<CommentMultiviewer
				v-if="mayReadComment"
				v-model="comments"
				:post="post"
				:may-view-archived-or-restore="mayViewArchivedOrRestore"/>
		</div>
	</article>
</template>

<style lang="scss">
	article {
		@apply flex flex-col flex-nowrap justify-center;

		> .comments {
			@apply flex-1 flex-row flex-wrap sm:flex-1 flex-row flex-wrap;
			@apply p-5  bg-gray-300 bg-opacity-20 shadow-inner;
			max-width: 100%;
		}
		.field {
			@apply flex flex-row flex-wrap;
			max-width:100%;
		}

		> * {
			@apply mb-4;
		}
	}
</style>

<script setup lang="ts">
import { inject, computed, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedPostResource } from "$/types/documents/post"
import type {
	DeserializedCommentListDocument,
	DeserializedCommentResource
} from "$/types/documents/comment"

import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
} from "$/permissions/comment_combinations"

import Viewer from "@/post/multiviewer/viewer.vue"
import CommentMultiviewer from "@/comment/multiviewer.vue"
import CreateCommentField from "@/comment/create_field.vue"

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
const mayViewArchivedOrRestore = computed<boolean>(() => {
	const isOwned = post.value.poster.data.id === userProfile.data.id

	const isPermitted = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
		ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
		ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
	])

	return isOwned || isPermitted
})

const comments = ref<DeserializedCommentListDocument<"user">>(
	pageProps.comments as DeserializedCommentListDocument<"user">
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

const mayReadComment = computed<boolean>(() => {
	const isPermitted = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		READ_ANYONE_ON_OWN_DEPARTMENT,
		READ_ANYONE_ON_ALL_DEPARTMENTS
	])

	return isPermitted
})

function includeComment(newComment: DeserializedCommentResource<"user">): void {
	comments.value = {
		...comments.value,
		"data": [
			...comments.value.data,
			newComment
		],
		"meta": {
			...comments.value.meta,
			"count": (comments.value.meta?.count || 0) + 1
		}
	}
}
</script>
