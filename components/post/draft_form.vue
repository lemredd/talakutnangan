<template>
	<form @submit.prevent="submitPostDetails">
		<!-- TODO(others): Merge the following classes into one -->
		<slot></slot>
		<div class="row flex flex-row">
			<div class="label flex-1 mt-1">
				<label for="content">Content</label>
			</div>
			<div class="field flex-3 mt-1">
				<textarea
					id="content"
					v-model="content"
					class="height-[4em]"
					placeholder="Write something..">
				</textarea>
			</div>
		</div>
	</form>
</template>

<style lang="scss">

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
