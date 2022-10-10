<template>
	<div class="controls relative">
		<button class="material-icons" @click="togglePostMenu(post)">
			more_vert
		</button>
		<Dropdown
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
		</Dropdown>
	</div>
</template>

<script setup lang="ts">
import Dropdown from "@/page_shell/dropdown.vue"
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
