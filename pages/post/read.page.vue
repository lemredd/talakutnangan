<template>
	<div class="post-container">
		<Viewer v-model="post"/>
		<CreateField v-if="mayCreateComment" :post="post"/>
		<Multiviewer v-model="comments"/>
	</div>
</template>

<style lang="scss">
</style>

<script setup lang="ts">
import { inject, ref } from "vue"

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

// TODO: Correct the specialization
const mayCreateComment = computed<boolean>(() => {
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

	const isPermitted = isLimitedPersonalScope
	|| isLimitedUpToDepartmentScope
	|| isLimitedUpToGlobalScope

	return isPermitted && post.value.deletedAt === null
})

</script>
