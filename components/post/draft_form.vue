<template>
	<form @submit.prevent="submitPostDetails">
		<div class="row">
			<div class="col-25">
				<label for="content">Content</label>
			</div>
			<div class="col-75">
				<textarea
					id="content"
					v-model="content"
					placeholder="Write something.."
					style="height:200px">
				</textarea>
			</div>
		</div>
		<div class="row">
			<input type="submit" value="Submit"/>
		</div>
	</form>
</template>
<style lang="scss">
@import "../index";
</style>
<script setup lang="ts">
import { ref } from "vue"

const content = ref("")

// Post submit
function submitPostDetails() {
	const titleText = title.value.trim()
	// Creation
	const descriptionText = content.value.trim()
	if (titleText.valueOf() == "" || descriptionText.valueOf() == "") {
		alert("Fields are empty!")
	} else {
		createPost(1, dummyUserDemo[0].userName, titleText, descriptionText, [], [], false, true, false)
		// Seclusion
		posts.value.forEach((post: Post, i: number) => {
			getSecludedPost(post, secludedPosts.value, i)
		})
		// Finishing
		alert("Successfully posted!")
		// Console.log(secludedPosts.value);
		isCreateShown.value = true
		title.value = ""
		content.value = ""
	}

	// Checking posts creation
	for (let i = 0; i < posts.value.length; i++) {
		console.log("creation ", posts.value[i])
	}
}
</script>
