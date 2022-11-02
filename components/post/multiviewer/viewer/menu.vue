<template>
	<MinorDropdown v-if="shouldHaveMenu" v-model="isDropdownShown">
		<template #dropdown-contents>
			<button v-if="mayUpdatePost" @click="updatePost">
				Update post
			</button>
			<button v-if="mayArchivePost" @click="archivePost">
				Archive post
			</button>
			<button v-if="mayRestorePost" @click="restorePost">
				Restore post
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
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import makeSwitch from "$@/helpers/make_switch"
import isUndefined from "$/type_guards/is_undefined"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import MinorDropdown from "@/helpers/minor_dropdown.vue"

const props = defineProps<{
	post: DeserializedPostResource<"poster"|"department">
}>()

interface CustomEvents {
	(event: "updatePost"): void
	(event: "archivePost"): void
	(event: "restorePost"): void
}
const emit = defineEmits<CustomEvents>()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const {
	"state": isDropdownShown
} = makeSwitch(false)

const poster = computed<DeserializedUserResource>(
	() => props.post.poster.data as DeserializedUserResource
)
const department = computed<DeserializedDepartmentResource|undefined>(
	() => props.post.department?.data as DeserializedDepartmentResource|undefined
)

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
			isOwned
				|| !isUndefined(department.value)
				&& department.value?.id === userProfile.data.department.data.id
		)

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT
		])

	const isPermitted = isLimitedPersonalScope
	|| isLimitedUpToDepartmentScope
	|| isLimitedUpToGlobalScope

	return isPermitted && !props.post.deletedAt
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
			isOwned || !isUndefined(department.value)
				&& department.value?.id === userProfile.data.department.data.id
		)

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			ARCHIVE_AND_RESTORE_PUBLIC_POST_ON_ANY_DEPARTMENT
		])

	return isLimitedPersonalScope || isLimitedUpToDepartmentScope || isLimitedUpToGlobalScope
})

const mayArchivePost = computed<boolean>(() => {
	const isPermitted = mayArchiveOrRestorePost.value
	return isPermitted && !props.post.deletedAt
})

const mayRestorePost = computed<boolean>(() => {
	const isPermitted = mayArchiveOrRestorePost.value
	return isPermitted && Boolean(props.post.deletedAt)
})

const shouldHaveMenu = computed<boolean>(
	() => mayUpdatePost.value || mayArchivePost.value || mayRestorePost.value
)

function updatePost() {
	emit("updatePost")
}

function archivePost() {
	emit("archivePost")
}

function restorePost() {
	emit("restorePost")
}
</script>
