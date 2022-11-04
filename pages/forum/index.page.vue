<template>
	<div class="main">
		<div class="created-post" @click="showCreateForm">
			<ProfilePicture
				class="account-attachment"
				:user="userProfile"/>
			<span class="post-create">
				Welcome To Forum
			</span>
			<span class="create-post btn btn-primary">
				add post
			</span>
		</div>
		<CreatePostForm
			:is-shown="isCreateShown"
			accept="*/*"
			@close="hideCreateForm"/>
		<Multiviewer
			v-model="posts"
			class="multiviewer"/>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	@import "@styles/variables.scss";
	.main {
		@apply flex flex-col flex-nowrap justify-start items-stretch;

		.created-post {
			@apply flex-1 flex justify-between items-center;
			@apply mb-5 p-4 rounded-1rem shadow-inner bg-light-800;

			// .post-create {
			// 	@apply p-4 rounded-1rem bg-gray-300 text-gray-500;
			// 	width: 90%;
			// }

			.account-attachment {
				@apply h-6 w-auto;
			}
			.create-post {
				@apply w-auto rounded-[0.5rem];
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
import { ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostResource } from "$/types/documents/post"

import makeSwitch from "$@/helpers/make_switch"

import Multiviewer from "@/post/multiviewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

type RequiredExtraProps = "posts"|"departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const posts = ref<DeserializedPostResource<"poster"|"posterRole"|"department">[]>(
	pageProps.posts.data as DeserializedPostResource<"poster"|"posterRole"|"department">[]
)

const {
	"state": isCreateShown,
	"on": showCreateForm,
	"off": hideCreateForm
} = makeSwitch(false)
</script>
