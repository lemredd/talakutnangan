<template>
	<div>
		<h3>{{ label }}</h3>
		<ul class="selected-options">
			<li v-for="option in selectedOptions" :key="option.value">
				{{
					option.label ?? option.value
				}}
				<button
					type="button"
					class="close material-icons-outlined"
					@click="removeOption(option.value)">
					close
				</button>
			</li>
		</ul>
		<SelectableOptionsField
			v-model="currentOption"
			:options="remainingOptions"
			:placeholder="placeholder">
			<template #after-dropdown>
				<button
					type="button"
					class="material-icons"
					@click="addCurrentOption">
					add
				</button>
			</template>
		</SelectableOptionsField>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { OptionInfo } from "$@/types/component"

import subtract from "$/helpers/array/subtract"

import SelectableOptionsField from "@/fields/selectable_options.vue"

const {
	options,
	modelValue,
	label,
	placeholder
} = defineProps<{
	options: readonly OptionInfo[]
	modelValue: string[]
	label: string
	placeholder?: string
}>()

const selectedOptions = computed<OptionInfo[]>(() => {
	const chosenOptions = options.filter(option => modelValue.includes(option.value)) as OptionInfo[]
	return chosenOptions
})

const remainingOptions = computed<OptionInfo[]>(() => subtract(options, selectedOptions.value))

const currentOption = ref<string>(remainingOptions.value[0].value)

interface CustomEvents {
	(eventName: "update:modelValue", data: string[]): void
}
const emit = defineEmits<CustomEvents>()

function addCurrentOption() {
	emit("update:modelValue", [
		...modelValue,
		currentOption.value
	])
}

function removeOption(removedValue: string) {
	emit("update:modelValue", modelValue.filter(value => value !== removedValue))
}
</script>
