<template>
	<div
		v-for="(post, i) in posts"
		:key="post.id"
		class="post">
		<div v-if="post">
			<div class="post-container flex justify-between w-[100%] pb-[5em]">
				<div class="post-title">
					<h2 class="font-bold">
						Post
					</h2>
				</div>
				<div class="">
				</div>
				<Menu :post="post"/>
			</div>
			<UpdatePostForm
				v-model="posts[i]"
				:is-shown="mustUpdate"
				@submit="submitChangesSeparately"/>
			<div class="post-container" :hidden="post.isPostShown">
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
import { ref, computed } from "vue"
import {
	voteCountUpdate,
	determineUserVoted,
	upVote,
	downVoteCountUpdate,
	determineUserDownVoted,
	downVote,
	totalVotes
} from "./../../pages/forum/post"

import Menu from "@/post/viewer/menu.vue"
import UpdatePostForm from "./viewer/update_post_form.vue"

import type { DeserializedPostResource } from "$/types/documents/post"

import makeSwitch from "$@/helpers/make_switch"

const props = defineProps<{
	modelValue: DeserializedPostResource<"poster"|"posterRole">[]
}>()

interface CustomEvents {
	(event: "update:modelValue", post: DeserializedPostResource<"poster"|"posterRole">[]): void
}
const emit = defineEmits<CustomEvents>()

const posts = computed<DeserializedPostResource<"poster"|"posterRole">[]>({
	get(): DeserializedPostResource<"poster"|"posterRole">[] {
		return props.modelValue
	},
	set(newValue: DeserializedPostResource<"poster"|"posterRole">[]): void {
		emit("update:modelValue", newValue)
	}
})

const {
	"state": mustUpdate,
	"on": openEditForm
} = makeSwitch(false)

async function submitChangesSeparately(postID: string) {

}
</script>
