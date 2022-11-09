<template>
	<div class="main">
		<div class="forum-header">
			<h1>
				Welcome to the Forum
			</h1>
			<button
				v-if="mayPost"
				class="create-post btn btn-primary"
				@click="showCreateForm">
				add post
			</button>
		</div>
		<CreatePostForm
			:is-shown="isCreateShown"
			:departments="departments"
			@close="hideCreateForm"/>
		<Multiviewer
			v-model="posts"
			:departments="departments"
			class="multiviewer"/>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	@import "@styles/variables.scss";
	.main {
		@apply flex flex-col flex-nowrap justify-center items-stretch;

		.forum-header {
			h1 {
				@apply p-2 bg-gray-400 bg-opacity-10;
				@apply text-xl;
			}
			.account-attachment {
				@apply h-6 w-auto;
			}
			.create-post {
				@apply w-auto;
			}

		}
		.file-media{
			@apply mr-2;
		}

		.multiviewer {
			@apply flex-1 m-5;
		}
	}

</style>

<script setup lang="ts">
import { ref, inject, onMounted, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostListDocument } from "$/types/documents/post"
import type {
	DeserializedDepartmentListDocument,
	DeserializedDepartmentResource
} from "$/types/documents/department"

import makeSwitch from "$@/helpers/make_switch"
import DepartmentFetcher from "$@/fetchers/department"
import loadRemainingDepartments from "@/resource_management/load_remaining_departments"

import { post as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_ALL_DEPARTMENTS,
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
	CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import Multiviewer from "@/post/multiviewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

type RequiredExtraProps = "posts"|"departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const posts = ref<DeserializedPostListDocument<"poster"|"posterRole"|"department">>(
	pageProps.posts as DeserializedPostListDocument<"poster"|"posterRole"|"department">
)

const departments = ref<DeserializedDepartmentListDocument>(
	pageProps.departments as DeserializedDepartmentListDocument
)

const {
	"state": isCreateShown,
	"on": showCreateForm,
	"off": hideCreateForm
} = makeSwitch(false)

const departmentFetcher = new DepartmentFetcher()
onMounted(async() => {
	const mayViewAllDepartments = permissionGroup.hasOneRoleAllowed(
		userProfile.data.roles.data,
		[ READ_ANYONE_ON_ALL_DEPARTMENTS ]
	)

	if (mayViewAllDepartments) {
		await loadRemainingDepartments(departments, departmentFetcher)
	} else {
		departments.value = {
			...departments.value,
			"data": [
				...departments.value.data,
				userProfile.data.department.data as DeserializedDepartmentResource
			],
			"meta": {
				...departments.value.meta,
				"count": departments.value.meta?.count || 1
			}
		}
	}
})

const mayPost = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const isLimitedToOwnDepartment = permissionGroup.hasOneRoleAllowed(users, [
		CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT
	])

	const isLimitedoAnyDepartment = permissionGroup.hasOneRoleAllowed(users, [
		CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
	])

	const isLimitedToSocialPost = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT
	])

	return isLimitedToOwnDepartment || isLimitedoAnyDepartment || isLimitedToSocialPost
})
</script>
