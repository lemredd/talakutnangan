<template>
	<div class="selectable-checkbox">
		<Suspensible :is-loaded="isLoaded">
			{{ title }}
			<label>
				<input
					v-model="hasUpvoted"
					title="upvote"
					type="checkbox"/>
			</label>
			<label>
				<input
					v-model="hasDownvoted"
					title="downvote"
					type="checkbox"/>
			</label>
		</Suspensible>
	</div>
</template>

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
