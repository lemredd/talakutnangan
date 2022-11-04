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
		<SelectableExistence v-model="existence"/>
		<Multiviewer
			v-model="posts.data"
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
import { ref, computed, inject, onMounted, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedPostListDocument } from "$/types/documents/post"
import type {
	DeserializedDepartmentListDocument,
	DeserializedDepartmentResource
} from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/post"
import debounce from "$@/helpers/debounce"
import makeSwitch from "$@/helpers/make_switch"
import DepartmentFetcher from "$@/fetchers/department"
import loadRemainingDepartments from "@/resource_management/load_remaining_departments"

import { post as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/post_combinations"

import Multiviewer from "@/post/multiviewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"
import SelectableExistence from "@/fields/selectable_radio/existence.vue"

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
const NULL_AS_STRING = "~"
const departmentNames = computed<OptionInfo[]>(() => [
	{
		"label": "General",
		"value": NULL_AS_STRING
	},
	...departments.value.data.map(data => ({
		"label": data.fullName,
		"value": data.id
	}))
])
const chosenDepartment = ref(userProfile.data.department.data.id)
const existence = ref<string>("exists")

const {
	"state": isCreateShown,
	"on": showCreateForm,
	"off": hideCreateForm
} = makeSwitch(false)

const fetcher = new Fetcher()
async function retrievePosts() {
	await fetcher.list({
		"filter": {
			"departmentID": chosenDepartment.value === NULL_AS_STRING ? null : chosenDepartment.value,
			"existence": existence.value
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": posts.value.data.length
		},
		"sort": [ "-createdAt" ]
	}).then(({ body }) => {
		const castBody = body as DeserializedPostListDocument<"poster"|"posterRole"|"department">
		posts.value = {
			...posts.value,
			"data": [
				...posts.value.data,
				...castBody.data
			]
		}
	})
}

function resetPostList() {
	posts.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	retrievePosts()
}

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

	watch(
		[ chosenDepartment, existence ],
		debounce(resetPostList, DEBOUNCED_WAIT_DURATION)
	)
})
</script>
