<template>
	<form @submit.prevent="submitPostDetails">
		<slot></slot>
		<div class="row">
			<div class="col-25">
				<label for="content">Content</label>
			</div>
			<div class="col-75">
				<textarea
					id="content"
					v-model="content"
					placeholder="Write something.."
					style="height:200px">
				</textarea>
			</div>
		</div>
	</form>
</template>

<style lang="scss">
@import "@@/forum/index";
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
