<template>
	<div class="flex flex-col text-light-100">
		<label class="flex-1">
			{{ label }}
		</label>
		<input
			class="flex-1 bg-transparent"
			:type="type"
			:value="modelValue"
			@input="emitUpdate"
			:required="required"
			/>
	</div>
</template>

<style scoped>
input {
	border-bottom: 1px solid white;
	padding-bottom: .25em;
}
</style>

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
