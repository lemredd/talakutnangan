<template>
	<div class="controls relative">
		<Dropdown
			class="postmenu absolute top-[2em] right-0 flex flex-col"
			@close="togglePostMenu(post)">
			<template #toggler>
				<button class="material-icons">
					more_vert
				</button>
			</template>
			<template #dropdown-contents>
				<button v-if="dummyUserDemo[0].userName===post.user" @click="editPost(post)">
					Edit
				</button>
				<button v-if="dummyUserDemo[0].userName===post.user" @click="deletePost(post,i)">
					Delete
				</button>
				<button v-if="dummyUserDemo[0].userName!==post.user" @click="reportPost(post)">
					Report
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

import PermissionGroup from "$/permissions/post"
import {
	UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import Dropdown from "@/page_shell/dropdown.vue"

const props = defineProps<{
	post: DeserializedPostResource<"poster">
}>()

interface CustomEvents {
	(event: "editPost", postID: string): void
	(event: "deletePost", postID: string): void
}
const emit = defineEmits<CustomEvents>()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const poster = computed<DeserializedUserResource<"department">>(
	() => props.post.poster.data as DeserializedUserResource<"department">
)

const permissionGroup = new PermissionGroup()
const mayUpdatePost = computed<boolean>(() => {
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT
	])

	const isOwned = userProfile.data.id === props.post.id
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

	return isLimitedPersonalScope || isLimitedUpToDepartmentScope || isLimitedUpToGlobalScope
})
// Post edit
function editPost(post: Post) {
	console.log(post)
	post.isPostShown = !post.isPostShown
	post.isEditShown = !post.isEditShown

	titleToEdit.value = post.title
	descToEdit.value = post.desc
}

// Post delete
function deletePost(post: Post, index: number) {
	const postClones = [ ...posts.value ]
	const deletedPosts = postClones.splice(index, 1)
	posts.value = postClones

	// Checking'
	for (let i = 0; i < deletedPosts.length; i++) {
		console.log("post deleted", deletedPosts[i])
	}

	for (let i = 0; i < posts.value.length; i++) {
		console.log("all posts", posts.value[i])
	}
	alert("Successfully deleted!")
}

// Reprt post
function reportPost(post: Post) {
	alert("Post reported!")
}
</script>
