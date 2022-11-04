<template>
	<article>
		<Viewer
			v-model="post"
			:comment-count="commentCount"/>
		<div class="comments">
			<CreateField
				v-if="mayCreateComment"
				class="field"
				:post="post"
				@create-comment="includeComment"/>
			<Multiviewer v-model="comments.data"/>
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
import { inject, computed, ref, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedCommentListDocument } from "$/types/documents/comment"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/comment"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import Multiviewer from "@/comment/multiviewer.vue"
import Viewer from "@/post/multiviewer/viewer.vue"
import CreateField from "@/comment/create_field.vue"

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

function includeComment(newComment: DeserializedCommentListDocument<"user">): void {
	comments.value = {
		...comments.value,
		"data": [
			...comments.value.data,
			newComment
		],
		"meta": {
			...comments.value.meta,
			"count": comments.value.meta.count + 1
		}
	}
}

const fetcher = new Fetcher()
onMounted(async() => {
	await loadRemainingResource(comments, fetcher, () => ({
		"filter": {
			"existence": "exists",
			"postID": post.value.id
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": comments.value.data.length
		},
		"sort": [ "-createdAt" ]
	}))
})
</script>
