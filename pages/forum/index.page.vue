<template>
	<div class="main">
		<div class="created-post" @click="showCreateForm">
			<ProfilePicture
				class="account-attachment"
				:user="userProfile"/>
			<span class="post-create">
				What's on your mind?
			</span>
			<span class="material-icons account-attachment">
				attachment
			</span>
		</div>
		<CreatePostForm :is-shown="isCreateShown" @close="hideCreateForm"/>
		<SelectableOptionsField
			v-model="chosenDepartment"
			label="Department"
			:options="departmentNames"/>
		<Multiviewer
			v-model="posts"
			class="multiviewer"/>
	</div>
</template>

<style scoped lang="scss">
	.main {
		@apply flex flex-col flex-nowrap justify-start items-stretch;

		.created-post {
			@apply flex-1 flex justify-between items-center;
			@apply mb-5 p-4 rounded-1rem shadow-inner bg-light-800;

			.post-create {
				@apply p-4 rounded-1rem bg-gray-300 text-gray-500;
				width: 90%;
			}

			.account-attachment {
				@apply h-6 w-auto;
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
import { ref, computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import makeSwitch from "$@/helpers/make_switch"

import Multiviewer from "@/post/multiviewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

type RequiredExtraProps = "posts"|"departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const posts = ref<DeserializedPostResource<"poster"|"posterRole"|"department">[]>(
	pageProps.posts.data as DeserializedPostResource<"poster"|"posterRole"|"department">[]
)

const departments = ref<DeserializedDepartmentListDocument>(
	pageProps.departments as DeserializedDepartmentListDocument
)
const departmentNames = computed<OptionInfo[]>(() => [
	{
		"label": "General",
		"value": "~"
	},
	...departments.value.data.map(data => ({
		"label": data.fullName,
		"value": data.id
	}))
])
const chosenDepartment = ref(userProfile.data.department.data.id)

const {
	"state": isCreateShown,
	"on": showCreateForm,
	"off": hideCreateForm
} = makeSwitch(false)
</script>
