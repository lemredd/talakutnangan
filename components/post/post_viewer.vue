<template>
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
</template>

<style>

</style>

<script setup lang="ts">

import {
	voteCountUpdate,
	determineUserVoted,
	upVote,
	downVoteCountUpdate,
	determineUserDownVoted,
	downVote,
	totalVotes
} from "./post"
</script>
