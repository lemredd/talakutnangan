<template>
	<div>
		<div v-if="mustDisplayOnly" class="comment-container flex justify-between w-[100%] pb-[5em]">
			<div class="comment-user">
				<h2 class="font-bold">
					{{ comment.user }}
				</h2>
			</div>
			<p>
				{{ comment.content }}
			</p>
			<Menu
				:comment="comment"
				@update-comment="openUpdateField"
				@archive-comment="confirmArchive"
				@restore-comment="confirmRestore"/>
		</div>
		<div class="comment-container">
			<div class="left">
				<div><img src="@assets/emptyUser.png"/></div>
				<h2 class="title">
					{{ comment.user.data.name }}
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
		</div>
		<Overlay :is-shown="mustArchiveOrRestore" @close="closeArchiveOrRestore">
			<template #header>
				<h1>Enter the comment details</h1>
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
					Archive comment
				</button>
				<button
					v-if="mustRestore"
					class="btn submit-btn btn-primary"
					type="button"
					@click="restorePost">
					Restore comment
				</button>
			</template>
		</Overlay>
	</div>
</template>

<style lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import type { DeserializedCommentResource } from "$/types/documents/comment"

import Fetcher from "$@/fetchers/comment"
import makeSwitch from "$@/helpers/make_switch"

import Overlay from "@/helpers/overlay.vue"
import Menu from "@/comment/multiviewer/viewer/menu.vue"

const fetcher = new Fetcher()

const props = defineProps<{
	modelValue: DeserializedCommentResource<"user"|"parentComment">
}>()

interface CustomEvents {
	(event: "update:modelValue", comment: DeserializedCommentResource<"user"|"parentComment">): void
	(event: "archive", comment: DeserializedCommentResource<"user"|"parentComment">): void
	(event: "restore", comment: DeserializedCommentResource<"user"|"parentComment">): void
}
const emit = defineEmits<CustomEvents>()

const comment = ref<DeserializedCommentResource<"user"|"parentComment">>(props.modelValue)

const {
	"state": mustUpdate,
	"on": openUpdateField
} = makeSwitch(false)
const mustDisplayOnly = computed(() => !mustUpdate.value)

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
	await fetcher.update(comment.value.id, {
		"content": comment.value.content,
		"deletedAt": null
	}).then(() => {
		emit("update:modelValue", comment.value)
	})
}

async function archivePost(): Promise<void> {
	await fetcher.archive([ comment.value.id ]).then(() => {
		emit("archive", comment.value)
	})
}

async function restorePost(): Promise<void> {
	await fetcher.restore([ comment.value.id ]).then(() => {
		emit("restore", comment.value)
	})
}
</script>
