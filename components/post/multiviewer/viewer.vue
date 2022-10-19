<template>
	<div>
		<div class="post-container flex justify-between w-[100%] pb-[5em]">
			<div class="post-title">
				<h2 class="font-bold">
					Post
				</h2>
			</div>
			<div class="">
			</div>
			<Menu
				:post="post"
				@update-post="openUpdateForm"
				@archive-post="confirmArchive"
				@restore-post="confirmRestore"/>
		</div>
		<UpdatePostForm
			v-model="post"
			:is-shown="mustUpdate"
			@submit="submitChangesSeparately"/>
		<div class="post-container" :hidden="post.isPostShown">
			<div class="left">
				<div><img src="@assets/emptyUser.png"/></div>
				<h2 class="title">
					{{ post.poster.data.name }}
				</h2>
			</div>
			<div class="right">
				<h2 class="title">
					<!-- TODO: Put the total number of upvotes here -->
				</h2>
				<label class="switch">
					<!-- TODO: Put a checkbox to upvote -->
					<span class="slider"></span>
				</label>
				<h2 class="title">
					<!-- TODO: Put the total number of downvotes here -->
				</h2>
				<label class="switch">
					<!-- TODO: Put a checkbox to downvote -->
					<span class="slider"></span>
				</label>

				<h2 class="title">
					<!-- TODO: Put the total number of votes here -->
				</h2>
			</div>
			<p>
				{{ post.content }}
			</p>
		</div>
	</div>
</template>

<style>

</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"

import Menu from "@/post/multiviewer/viewer/menu.vue"
import UpdatePostForm from "@/post/multiviewer/viewer/update_post_form.vue"

import makeSwitch from "$@/helpers/make_switch"

const props = defineProps<{
	modelValue: DeserializedPostResource<"poster"|"posterRole">
}>()

interface CustomEvents {
	(event: "update:modelValue", post: DeserializedPostResource<"poster"|"posterRole">): void
	(event: "delete", post: DeserializedPostResource<"poster"|"posterRole">): void
	(event: "restore", post: DeserializedPostResource<"poster"|"posterRole">): void
}
const emit = defineEmits<CustomEvents>()

const post = ref<DeserializedPostResource<"poster"|"posterRole">>(props.modelValue)

const {
	"state": mustUpdate,
	"on": openUpdateForm
} = makeSwitch(false)

const {
	"state": mustArchive,
	"on": confirmArchive
} = makeSwitch(false)

const {
	"state": mustRestore,
	"on": confirmRestore
} = makeSwitch(false)

async function submitChangesSeparately(postID: string) {

}
</script>
