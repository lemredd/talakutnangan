<template>
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
				<Menu/>
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
			<div class="post-container" :hidden="post.isPostShown">
				<div class="left">
					<div><img src="./images/emptyUser.png"/></div>
					<h2 class="title">
						{{ post.user }}
					</h2>
				</div>
				<div class="middle">
					<h2 class="title">
						{{ post.title }}
						{{ post.badWordExist() }}
					</h2>
				</div>
				<div class="right">
					<h2 class="title">
						{{ voteCountUpdate(post) }}
					</h2>
					<label class="switch">
						<input
							type="checkbox"
							:checked="determineUserVoted(post)"
							class="switch"
							@click="upVote($event, post)"/>
						<span class="slider"></span>
					</label>
					<h2 class="title">
						{{ downVoteCountUpdate(post) }}
					</h2>
					<label class="switch">
						<input
							type="checkbox"
							:checked="determineUserDownVoted(post)"
							class="switch"
							@click="downVote($event, post)"/>
						<span class="slider"></span>
					</label>

					<h2 class="title">
						{{ totalVotes(post) }}
					</h2>
				</div>
				<p :class="`${post.id}`">
					{{ post.desc }}
				</p>
			</div>
			<!--  -->
		</div>
		<br/>
	</div>
</template>

<style scoped lang="scss">
.post-container {
	@apply outline-solid-black overflow-hidden
}
</style>

<script setup lang="ts">
import {
	voteCountUpdate,
	determineUserVoted,
	upVote,
	downVoteCountUpdate,
	determineUserDownVoted,
	secludePostDiv,
	downVote,
	totalVotes
} from "./post"

import Menu from "@/post/post_viewer/menu.vue"
</script>
