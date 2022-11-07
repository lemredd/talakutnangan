<template>
	<Suspensible :is-loaded="isLoaded">
		<div class="vote-view">
			<label class="material-icons up-vote" :class="{ 'active-vote': hasUpvoted }">
				north_east
				<input
					v-model="hasUpvoted"
					class="hidden"
					title="upvote"
					type="checkbox"/>
			</label>
			<label class="material-icons down-vote" :class="{ 'active-vote': hasDownvoted }">
				south_west
				<input
					v-model="hasDownvoted"
					class="hidden"
					title="downvote"
					type="checkbox"/>
			</label>
			{{ title }}
		</div>
	</Suspensible>
</template>

<style scoped lang="scss">
	.vote-view {
		@apply flex items-center ml-2;
	}


	.up-vote {

		&.active-vote {
			@apply text-blue-300 font-900;
		}
	}

	.down-vote {
		&.active-vote {
			@apply text-red-300 font-900;
		}
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { CompleteVoteKind } from "$/types/documents/comment"

import Suspensible from "@/helpers/suspensible.vue"

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
