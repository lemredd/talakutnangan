<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->
<template>
	<div class="input-container">
		<input
			class="bg-transparent mr-2"
			type="checkbox"
			:class=inputClasses
			:checked="modelValue.includes(value)"
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
import uniq from "lodash.uniq"

const {
	label,
	modelValue,
	required = true,
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

const emit = defineEmits<{
	(e: "update:modelValue", modelValue: string[] ): void
}>()


function emitUpdate(event: Event) {
	const modelValueCopy = modelValue
	const eventTarget = (event.target as HTMLInputElement).value as string
	if (modelValueCopy.includes(eventTarget)) {
		delete modelValueCopy[modelValueCopy.indexOf(eventTarget)]
	} else {
		modelValueCopy.push(eventTarget)
	}
	emit("update:modelValue", uniq(modelValueCopy))
}
</script>
