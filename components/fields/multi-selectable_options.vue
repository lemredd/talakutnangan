<template>
	<div>
		<h3>{{ label }}</h3>
		<ul class="selected-options">
			<li v-for="option in selectedOptions" :key="option.value">
				{{
					option.label ?? option.value
				}}
			</li>
		</ul>
		<SelectableOptionsField
			v-model="currentOption"
			:options="remainingOptions"
			:placeholder="placeholder"/>
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
	label?: string
	placeholder?: string
}>()

const selectedOptions = computed<OptionInfo[]>(() => {
	const chosenOptions = options.filter(option => modelValue.includes(option.value)) as OptionInfo[]
	return chosenOptions
})

const remainingOptions = computed<OptionInfo[]>(() => subtract(options, selectedOptions.value))

const currentOption = ref<string>(remainingOptions.value[0].value)
</script>
