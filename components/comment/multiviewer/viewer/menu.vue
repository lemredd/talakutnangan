<template>
	<MinorDropdown v-if="shouldHaveMenu" v-model="isDropdownShown">
		<template #dropdown-contents>
			<button v-if="mayUpdateComment" @click="updateComment">
				Update comment
			</button>
			<button v-if="mayArchiveComment" @click="archiveComment">
				Archive comment
			</button>
			<button v-if="mayRestoreComment" @click="restoreComment">
				Restore comment
			</button>
		</template>
	</MinorDropdown>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	button {
		@apply flex-1 max-h-[4rem] py-4;
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import makeSwitch from "$@/helpers/make_switch"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	UPDATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	UPDATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
} from "$/permissions/comment_combinations"

import MinorDropdown from "@/helpers/minor_dropdown.vue"

const props = defineProps<{
	comment: DeserializedCommentResource<"user">
}>()

interface CustomEvents {
	(event: "updateComment", postID: string): void
	(event: "archiveComment", postID: string): void
	(event: "restoreComment", postID: string): void
}
const emit = defineEmits<CustomEvents>()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const {
	"state": isDropdownShown
} = makeSwitch(false)

const user = computed<DeserializedUserResource<"department">>(
	() => props.comment.user.data as DeserializedUserResource<"department">
)

const mayUpdateComment = computed<boolean>(() => {
	const isOwned = userProfile.data.id === user.value.id
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
	]) && isOwned

	const isLimitedUpToDepartmentScope = !isLimitedPersonalScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			UPDATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT
		])
		&& (
			isOwned || user.value.department.data.id === userProfile.data.department.data.id
		)

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			UPDATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
		])

	const isPermitted = isLimitedPersonalScope
	|| isLimitedUpToDepartmentScope
	|| isLimitedUpToGlobalScope

	return isPermitted && !props.comment.deletedAt
})

const mayArchiveOrRestoreComment = computed<boolean>(() => {
	const isOwned = userProfile.data.id === user.value.id
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
	]) && isOwned

	const isLimitedUpToDepartmentScope = !isLimitedPersonalScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT
		])
		&& (
			isOwned || user.value.department.data.id === userProfile.data.department.data.id
		)

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
		])

	return isLimitedPersonalScope || isLimitedUpToDepartmentScope || isLimitedUpToGlobalScope
})

const mayArchiveComment = computed<boolean>(() => {
	const isPermitted = mayArchiveOrRestoreComment.value
	return isPermitted && !props.comment.deletedAt
})

const mayRestoreComment = computed<boolean>(() => {
	const isPermitted = mayArchiveOrRestoreComment.value
	return isPermitted && Boolean(props.comment.deletedAt)
})

const shouldHaveMenu = computed<boolean>(
	() => mayUpdateComment.value || mayArchiveComment.value || mayRestoreComment.value
)

function updateComment() {
	emit("updateComment", props.comment.id)
}

function archiveComment() {
	emit("archiveComment", props.comment.id)
}

function restoreComment() {
	emit("restoreComment", props.comment.id)
}
</script>
