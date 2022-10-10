<template>
	<div>
		<!--header start-->
		<div class="top-bar">
			<div><img src="./images/emptyImage.png"/></div>
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
					{{ dummyUserDemo[0].userName }}
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

			<PostViewer/>
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
import { ref } from "vue"
import {
	posts,
	dummyUserDemo
} from "./post"

import makeSwitch from "$@/helpers/make_switch"

import PostViewer from "@/post/post_viewer.vue"
import CreatePostForm from "@/post/create_post_form.vue"

import type { Post } from "./data"

const titleToEdit = ref("")
const descToEdit = ref("")

const {
	"state": isCreateShown,
	"on": showCreateForm,
	"off": hideCreateForm
} = makeSwitch(true)


// Post edit
function editPostDetails(currentPost: Post) {
	const titleText = titleToEdit.value.trim()
	const descriptionText = descToEdit.value.trim()

	currentPost.title = titleText
	currentPost.desc = descriptionText

	currentPost.isPostShown = !currentPost.isPostShown
	currentPost.isEditShown = !currentPost.isEditShown

	alert("Successfully edited!")
}

// Toggles

function turnOffAllDropdown() {

}

function togglePostMenu(post: Post) {
	post.isMenuShown = !post.isMenuShown
}





/*
 * To create a post, the needed variables are
 *  - ID - 1
 *  - Username - 2
 *  - Post title - 3
 *  - Post description - 4
 *  - Empty voters object - 5
 *  - Empty down voters object - 6
 */

</script>
