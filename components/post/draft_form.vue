<template>
	<form @submit.prevent="submitPostDetails">
		<!-- TODO(others): Merge the following classes into one -->
		<slot></slot>
		<div class="row">
			<div class="field">
				<textarea
					v-model="content"
					class="post-message"
					placeholder="What's on your mind"></textarea>
			</div>
		</div>
	</form>
</template>

<style scoped lang="scss">
.field{
	@apply flex flex-row mt-1;

	.post-message{
		@apply p-4 rounded-1rem mb-5 border-1px border-solid;
		width:250%;

		@screen sm{
			@apply flex flex-row;
			max-width:100%;
			height:100%;

		}

	}
}
</style>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
	modelValue: string
}>()

interface CustomEvents {
	(event: "update:modelValue", data: string): void
	(event: "submitPost"): void
}
const emit = defineEmits<CustomEvents>()

const content = computed<string>({
	get(): string { return props.modelValue },
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})

function submitPostDetails() {
	emit("submitPost")
}
</script>
