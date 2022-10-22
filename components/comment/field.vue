<template>
	<div>
		<TextualField
			v-model="content"
			type="text"
			:status="fieldStatus"
			:may-save-implicitly="true"
			@save-implicitly="submit"
			@save="submit"/>
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

import type { FieldStatus } from "@/fields/types"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import TextualField from "@/fields/non-sensitive_text.vue"

interface CustomEvents {
	(event: "update:modelValue", data: string): void
	(event: "update:status", status: FieldStatus): void
	(event: "submitComment"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	parentComment?: DeserializedCommentResource,
	editable?: boolean,
	status: FieldStatus,
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
const fieldStatus = computed<FieldStatus>({
	get(): FieldStatus {
		return props.status
	},
	set(newValue: FieldStatus): void {
		emit("update:status", newValue)
	}
})

function submit() {
	emit("submitComment")
}
</script>
