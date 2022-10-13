<template>
	<div>
		<!--header start-->
		<div class="top-bar">
			<div><img src="@assets/emptyImage.png"/></div>
			<h4>
				Secluded Posts
			</h4>
		</div>
		<!--header end-->

		<!--body start-->
		<div class="main">
			<br/>

			<div
				v-for="post in secludedPosts"
				:key="post.id"
				class="post">
				<div class="post-container">
					<div class="left">
						<div><img src="@assets/emptyUser.png"/></div>
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
@import "../index";
</style>

<script setup lang="ts">
import {
	secludedPosts,
	upVote,
	voteCountUpdate,
	determineUserVoted,
	downVoteCountUpdate,
	determineUserDownVoted,
	downVote,
	totalVotes
} from "@@/forum/post"

</script>
