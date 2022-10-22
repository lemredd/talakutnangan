<template>
	<div>
		<TextualField
			v-model="content"
			type="text"
			:may-save-implicitly="true"
			@save-implicitly="submit"/>
		<button class="material-icons" @click="submit">
			send
		</button>
		<slot name="additional-button-items"></slot>
	</div>
</template>

<style lang="scss">

</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedCommentResource } from "$/types/documents/comment"

import TextualField from "@/fields/non-sensitive_text.vue"

interface CustomEvents {
	(event: "update:modelValue", data: string): void
	(event: "submitComment"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	parentComment?: DeserializedCommentResource,
	modelValue: string
}>()

const content = computed<string>({
	get(): string {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})

function submit() {
	emit("submitComment")
}
</script>
