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

			<div
				v-for="(post, i) in posts"
				class="post"
				:hidden="secludePostDiv(post)">
				<div v-if="post">
					<div class="post-container flex justify-between w-[100%] pb-[5em]">
						<div class="post-title">
							<h2 class="font-bold">
								Post
							</h2>
						</div>
						<div class="">
						</div>
						<div class="controls relative">
							<button class="material-icons" @click="togglePostMenu(post)">
								more_vert
							</button>
							<PostMenu
								v-if="post.isMenuShown"
								class="postmenu absolute top-[2em] right-0 flex flex-col"
								@close="togglePostMenu(post)">
								<button v-if="dummyUserDemo[0].userName===post.user" @click="editPost(post)">
									Edit
								</button>
								<button v-if="dummyUserDemo[0].userName===post.user" @click="deletePost(post,i)">
									Delete
								</button>
								<button v-if="dummyUserDemo[0].userName!==post.user" @click="reportPost(post)">
									Report
								</button>
							</PostMenu>
						</div>
					</div>
					<!--  -->
					<div class="post-container" :hidden="post.isEditShown">
						<div class="container">
							<form @submit.prevent="editPostDetails(post)">
								<div class="row">
									<div class="col-25">
										<label for="title">Edit Title</label>
									</div>
									<div class="col-75">
										<input
											id="title"
											v-model="titleToEdit"
											type="text"
											name="title"
											placeholder="Your title.."/>
									</div>
								</div>
								<div class="row">
									<div class="col-25">
										<label for="desc">Edit Description</label>
									</div>
									<div class="col-75">
										<textarea
											id="desc"
											v-model="descToEdit"
											name="desc"
											placeholder="Write something.."
											style="height:200px"></textarea>
									</div>
								</div>
								<div class="row">
									<input type="submit" value="Submit"/>
								</div>
							</form>
						</div>
					</div>
					<!--  -->
					<PostViewer/>
				</div>
				<br/>
			</div>
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
	secludePostDiv,
	dummyUserDemo
} from "./post"

import makeSwitch from "$@/helpers/make_switch"

import PostViewer from "@/post/post_viewer.vue"
import PostMenu from "@/page_shell/dropdown.vue"
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
