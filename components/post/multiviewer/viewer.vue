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
		<Overlay :is-shown="mustArchiveOrRestore" @close="closeArchiveOrRestore">
			<template #header>
				<h1>Enter the post details</h1>
			</template>
			<template #default>
				<p v-if="mustArchive">
					Do you really want to archive?
				</p>
				<p v-if="mustRestore">
					Do you really want to restore?
				</p>
			</template>
			<template #footer>
				<button
					class="btn btn-back"
					type="button"
					@click="closeArchiveOrRestore">
					Back
				</button>
				<button
					v-if="mustArchive"
					class="btn submit-btn btn-primary"
					type="button"
					@click="archivePost">
					Archive post
				</button>
				<button
					v-if="mustRestore"
					class="btn submit-btn btn-primary"
					type="button">
					Update post
				</button>
			</template>
		</Overlay>
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

<style lang="sccs">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"

import Fetcher from "$@/fetchers/post"
import makeSwitch from "$@/helpers/make_switch"

import Overlay from "@/helpers/overlay.vue"
import Menu from "@/post/multiviewer/viewer/menu.vue"
import UpdatePostForm from "@/post/multiviewer/viewer/update_post_form.vue"

const fetcher = new Fetcher()

const props = defineProps<{
	modelValue: DeserializedPostResource<"poster"|"posterRole">
}>()

interface CustomEvents {
	(event: "update:modelValue", post: DeserializedPostResource<"poster"|"posterRole">): void
	(event: "archive", post: DeserializedPostResource<"poster"|"posterRole">): void
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
	"on": confirmArchive,
	"off": closeArchive
} = makeSwitch(false)

const {
	"state": mustRestore,
	"on": confirmRestore,
	"off": closeRestore
} = makeSwitch(false)

const mustArchiveOrRestore = computed<boolean>(() => mustArchive.value || mustRestore.value)

function closeArchiveOrRestore() {
	closeArchive()
	closeRestore()
}

async function submitChangesSeparately(): Promise<void> {
	await fetcher.update(post.value.id, {
		"content": post.value.content,
		"deletedAt": null
	}, {
		"extraDataFields": {
			"relationships": {
				// eslint-disable-next-line no-undefined
				"department": undefined,
				// eslint-disable-next-line no-undefined
				"postAttachments": undefined,
				"poster": {
					"data": {
						"id": post.value.poster.data.id,
						"type": "user"
					}
				},
				"posterRole": {
					"data": {
						"id": post.value.posterRole.data.id,
						"type": "role"
					}
				}
			}
		}
	}).then(() => {
		emit("update:modelValue", post.value)
	})
}

async function archivePost(): Promise<void> {
	await fetcher.archive([ post.value.id ]).then(() => {
		emit("archive", post.value)
	})
}
</script>
