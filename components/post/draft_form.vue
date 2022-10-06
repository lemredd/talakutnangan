<template>
	<form @submit.prevent="submitPostDetails">
		<div class="row">
			<div class="col-25">
				<label for="content">Content</label>
			</div>
			<div class="col-75">
				<textarea
					id="content"
					v-model="content"
					name="data[attributes][content]"
					placeholder="Write something.."
					style="height:200px">
				</textarea>
			</div>
			<input
				type="hidden"
				name="data[type]"
				value="post"/>
			<input
				v-if="modelValue.data.id"
				type="hidden"
				name="data[id]"
				value="modelValue.data.id"/>
		</div>
	</form>
</template>

<style lang="scss">
@import "../index";
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedPostDocument } from "$/types/documents/post"

const props = defineProps<{
	modelValue: DeserializedPostDocument<"create"|"update">
}>()

interface CustomEvents {
	(event: "update:modelValue", data: DeserializedPostDocument<"create"|"update">): void
	(event: "submitPost", data: FormData): void
}
const emit = defineEmits<CustomEvents>()

const content = computed<string>({
	get(): string { return props.modelValue.data.content },
	set(newValue: string): void {
		emit("update:modelValue", {
			...props.modelValue,
			"data": {
				...props.modelValue.data,
				"content": newValue
			}
		})
	}
})

function submitPostDetails(event: Event) {
	const form = event.target as HTMLFormElement
	const formData = new FormData(form)

	emit("submitPost", formData)
}
</script>
