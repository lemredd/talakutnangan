<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->
<template>
	<div class="input-container">
		<input
			class="bg-transparent mr-2"
			type="checkbox"
			:class=inputClasses
			:checked="modelValue.has(value)"
			:value="value"
			@change="emitUpdate"
			:disabled="disabled"
			ref="inputField"
			/>
		<label v-if="label" class="input-header">
			{{ label }}
		</label>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
const {
	label,
	modelValue,
	required = true,
	value,
	disabled,
	inputClasses
	} = defineProps<{
	label?: string
	modelValue: Set<string>
	value: string
	required?: boolean
	disabled?: boolean
	inputClasses?: string
}>()

const emit = defineEmits<{
	(e: "update:modelValue", modelValue: Set<string> ): void
}>()


function emitUpdate(event: Event) {
	const modelValueCopy = new Set([...modelValue])
	const eventTarget = (event.target as HTMLInputElement).value as string
	if (modelValueCopy.has(eventTarget)) {
		modelValueCopy.delete(eventTarget)
	} else {
		modelValueCopy.add(eventTarget)
	}
	emit("update:modelValue", modelValueCopy)
}
</script>
