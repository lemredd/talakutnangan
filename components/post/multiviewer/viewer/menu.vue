<template>
	<div class="controls relative">
		<Dropdown
			:is-dropdown-shown="isDropdownShown"
			class="postmenu absolute top-[2em] right-0 flex flex-col"
			@toggle="toggleDropdown"
			@resize="toggleDropdown">
			<template #toggler>
				<button class="material-icons">
					more_vert
				</button>
			</template>
			<template #dropdown-contents>
				<button v-if="mayUpdatePost" @click="updatePost">
					Edit
				</button>
				<button v-if="mayArchivePost" @click="archivePost">
					Archive
				</button>
				<button v-if="mayRestorePost" @click="restorePost">
					Restore
				</button>
			</template>
		</Dropdown>
	</div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedUserResource } from "$/types/documents/user"

import makeSwitch from "$@/helpers/make_switch"
import PermissionGroup from "$/permissions/post"
import {
	UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import Dropdown from "@/page_shell/dropdown.vue"

const props = defineProps<{
	post: DeserializedPostResource<"poster">
}>()

interface CustomEvents {
	(event: "updatePost", postID: string): void
	(event: "archivePost", postID: string): void
	(event: "restorePost", postID: string): void
}
const emit = defineEmits<CustomEvents>()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const {
	"state": isDropdownShown,
	"toggle": toggleDropdown
} = makeSwitch(false)

const poster = computed<DeserializedUserResource<"department">>(
	() => props.post.poster.data as DeserializedUserResource<"department">
)

const permissionGroup = new PermissionGroup()
const mayUpdatePost = computed<boolean>(() => {
	const isOwned = userProfile.data.id === poster.value.id
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT
	]) && isOwned

	const isLimitedUpToDepartmentScope = !isLimitedPersonalScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT
		])
		&& (
			isOwned || poster.value.data.department?.data.id === userProfile.data.department.data.id
		)

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT
		])

	const isPermitted = isLimitedPersonalScope
	|| isLimitedUpToDepartmentScope
	|| isLimitedUpToGlobalScope

	return isPermitted && props.post.deletedAt === null
})

const mayArchiveOrRestorePost = computed<boolean>(() => {
	const isOwned = userProfile.data.id === poster.value.id
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		ARCHIVE_AND_RESTORE_PERSONAL_POST_ON_OWN_DEPARTMENT
	]) && isOwned

	const isLimitedUpToDepartmentScope = !isLimitedPersonalScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			ARCHIVE_AND_RESTORE_SOCIAL_POST_ON_OWN_DEPARTMENT
		])
		&& (
			isOwned || poster.value.data.department?.data.id === userProfile.data.department.data.id
		)

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			ARCHIVE_AND_RESTORE_PUBLIC_POST_ON_ANY_DEPARTMENT
		])

	return isLimitedPersonalScope || isLimitedUpToDepartmentScope || isLimitedUpToGlobalScope
})

const mayArchivePost = computed<boolean>(() => {
	const isPermitted = mayArchiveOrRestorePost.value
	return isPermitted && props.post.deletedAt === null
})

const mayRestorePost = computed<boolean>(() => {
	const isPermitted = mayArchiveOrRestorePost.value
	return isPermitted && props.post.deletedAt !== null
})

function updatePost() {
	emit("updatePost", props.post.id)
}

function archivePost() {
	emit("archivePost", props.post.id)
}

function restorePost() {
	emit("restorePost", props.post.id)
}
</script>