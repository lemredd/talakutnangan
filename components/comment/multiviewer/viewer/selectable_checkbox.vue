<template>
	<div class="vote-view">
		<Suspensible :is-loaded="isLoaded">
			{{ title }}
			<label class="material-icons up-vote">
				north_east
				<input
					v-model="hasUpvoted"
					class="hidden"
					title="upvote"
					type="checkbox"/>
			</label>
			<label class="material-icons down-vote">
				south_west
				<input
					v-model="hasDownvoted"
					class="hidden"
					title="downvote"
					type="checkbox"/>
			</label>
		</Suspensible>
	</div>
</template>

<style scoped lang="scss">
	.vote-view {
		@apply flex items-center ml-2;
	}


	.up-vote {
		@apply ml-10;
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { CompleteVoteKind } from "$/types/documents/comment"

import Suspensible from "@/suspensible.vue"

const props = defineProps<{
	title: string,
	isLoaded: boolean,
	modelValue: CompleteVoteKind,
}>()

const emit = defineEmits<{(e: "update:modelValue", value: CompleteVoteKind): void}>()

const hasUpvoted = computed<boolean>({
	get(): boolean {
		return props.modelValue === "upvote"
	},
	set(newValue: boolean): void {
		if (newValue) emit("update:modelValue", "upvote")
		else emit("update:modelValue", "abstain")
	}
})

const hasDownvoted = computed<boolean>({
	get(): boolean {
		return props.modelValue === "downvote"
	},
	set(newValue: boolean): void {
		if (newValue) emit("update:modelValue", "downvote")
		else emit("update:modelValue", "abstain")
	}
})
</script>
