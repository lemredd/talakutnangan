<template>
	<div>
		<div class="post ">
			<div class="flex justify-between m-5 p-4 rounded-1rem shadow-inner bg-light-800">
				<span class="profile material-icons">
					account_circle
				</span>
				<input
					type="text"
					placeholder="What's on your mind?"
					class="post-message p-4 rounded-1rem bg-gray-300 text-dark-500 w-l-180"/>
				<span class="attachment material-icons">
					attachment
				</span>
			</div>
		</div>
		<div class="top-bar">
		</div>
		<main>
			<br/>
			<div class="post-container">
				<div class="left">
					{{ userProfile.data.name }}
				</div>
				<div class="right">
					<button @click="showCreateForm()">
						Create
					</button>
				</div>
			</div>
			<CreatePostForm :is-shown="isCreateShown" @close="hideCreateForm"/>

			<MultiplePostViewer v-model="posts"/>
		</main>
		<footer>
			<p>
				Footer space<br/>
				<a href="./forum">email@example.com</a>
			</p>
		</footer>
	</div>
</template>

<style scoped lang="scss">

.profile{
	font-size: 40px;
}
.attachment{
	font-size: 40px;
}

// .post_message{
// position: fixed;

// }
</style>

<script setup lang="ts">
import { ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostResource } from "$/types/documents/post"

import makeSwitch from "$@/helpers/make_switch"

import MultiplePostViewer from "@/post/multiviewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

type RequiredExtraProps = "posts"|"departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const posts = ref<DeserializedPostResource<"poster"|"posterRole">[]>(
	pageProps.posts.data as DeserializedPostResource<"poster"|"posterRole">[]
)

const {
	"state": isCreateShown,
	"on": showCreateForm,
	"off": hideCreateForm
} = makeSwitch(false)

</script>
