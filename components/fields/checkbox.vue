<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->
<template>
	<div class="input-container">
		<input
			ref="inputField"
			class="bg-transparent mr-2"
			type="checkbox"
			:class="inputClasses"
			:checked="modelValue.includes(value)"
			:value="value"
			:disabled="disabled"
			@change="emitUpdate"/>
		<label v-if="label" class="input-header">
			{{ label }}
		</label>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import makeUnique from "$/helpers/array/make_unique"

const {
	label,
	modelValue,
	value,
	disabled,
	inputClasses
} = defineProps<{
	label?: string
	modelValue: string[]
	value: string
	required?: boolean
	disabled?: boolean
	inputClasses?: string
}>()

const emit = defineEmits<{(e: "update:modelValue", newModelValue: string[]): void}>()


function emitUpdate(event: Event) {
	const modelValueCopy = modelValue
	const eventTarget = event.target as HTMLInputElement
	const eventValue = eventTarget.value as string
	if (modelValueCopy.includes(eventValue)) {
		delete modelValueCopy[modelValueCopy.indexOf(eventValue)]
	} else {
		modelValueCopy.push(eventValue)
	}
	emit("update:modelValue", makeUnique(modelValueCopy))
}
</script>
