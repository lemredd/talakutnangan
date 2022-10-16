<template>
	<div>
		<!--header start-->
		<div class="top-bar">
			<div><img src="@assets/emptyImage.png"/></div>
			<h4>
				Forum App
			</h4>
		</div>
		<!--header end-->

		<!--body start-->
		<div class="main">
			<br/>
			<div class="post-container">
				<div class="left">
					{{ userProfile.data.name }}
				</div>
				<div class="middle">
					<h1>What's on your mind?</h1>
				</div>
				<div class="right">
					<button @click="showCreateForm()">
						Create
					</button>
				</div>
			</div>
			<CreatePostForm :is-shown="isCreateShown" @close="hideCreateForm"/>

			<MultiplePostViewer v-model="posts"/>
		</div>
		<!--body end-->

		<!--footer start-->
		<footer>
			<p>
				Footer space<br/>
				<a href="./forum">email@example.com</a>
			</p>
		</footer>
		<!--footer end-->
	</div>
</template>

<style lang="scss">
@import "./index";
</style>

<script setup lang="ts">
import { ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostResource } from "$/types/documents/post"

import makeSwitch from "$@/helpers/make_switch"

import MultiplePostViewer from "@/post/multiviewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"

type RequiredExtraProps = "posts"
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
} = makeSwitch(true)

</script>
