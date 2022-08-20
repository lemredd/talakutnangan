<template>
	<div>
		<label :for="selectID">{{ label }}</label>
		<select :id="selectID" @change="updateModelValue">
			<option
				value=""
				:selected="modelValue === null"
				disabled>
				{{
					placeholder ?? "Please select"
				}}
			</option>

			<option
				v-for="option in options"
				:key="option"
				:value="option"
				:selected="modelValue === option">
				{{ option }}
			</option>
		</select>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import { computed } from "vue"
const {
	options,
	modelValue,
	label,
	placeholder
} = defineProps<{
	options: any[]
	modelValue: any|null
	label: string
	placeholder?: string
}>()

const selectID = computed(() => options.join(" ").replace(" ", "_"))

const emit = defineEmits<{(e: "update:modelValue", value: string): void}>()

function updateModelValue(event: Event) {
	const element = event.target as HTMLSelectElement
	emit("update:modelValue", element.value)
}
</script>
