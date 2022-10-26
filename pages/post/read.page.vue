<template>
	<section>
		<Viewer v-model="post"/>
		<CreateField
			v-if="mayCreateComment"
			class="field"
			:post="post"
			@create-comment="includeComment"/>
		<Multiviewer v-model="comments" class="comments"/>
	</section>
</template>

<style lang="scss">
	section {
		@apply flex flex-col flex-nowrap justify-center;

		> .field {
			@apply flex-initial;
		}

		> .comments {
			@apply flex-1;
		}

		> * {
			@apply mb-4;
		}
	}
</style>

<script setup lang="ts">
import { inject, computed, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedCommentResource } from "$/types/documents/comment"

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
const comments = ref<DeserializedCommentResource<"user"|"parentComment">[]>(
	pageProps.comments.data as DeserializedCommentResource<"user"|"parentComment">[]
)

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

function includeComment(newComment: DeserializedCommentResource<"user"|"parentComment">): void {
	comments.value.push(newComment)
}
</script>
