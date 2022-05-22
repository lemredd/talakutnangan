<template>
	<div class="flex flex-row flex-nowrap">
		<label class="flex-1 flex-grow flex-shrink-0">
			{{ label }}
		</label>
		<input
			:type="type"
			:value="modelValue"
			@input="emitUpdate"
			:required="required"
			/>
	</div>
</template>

<script setup lang="ts">
import type { Textual } from "@/fields/types"

const { label, type, modelValue, required = true } = defineProps<{
	label: string,
	type: Textual,
	modelValue: string,
	required?: boolean
}>()

const emit = defineEmits<{
	(e: "update:modelValue", modelValue: string ): void
}>()

function emitUpdate(event: Event) {
	emit("update:modelValue", (event.target as HTMLInputElement).value)
}
</script>
