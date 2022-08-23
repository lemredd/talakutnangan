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
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OptionInfo } from "$@/types/component"

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
</script>
