<template>
	<div class="selectable-radio">
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
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { CompleteVoteKind } from "$/types/documents/comment"

type ComponentProps = {
	title: string,
	modelValue: CompleteVoteKind,
}

const props = defineProps<ComponentProps>()

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
