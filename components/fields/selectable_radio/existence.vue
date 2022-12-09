<template>
	<SelectableExistence
		v-model="existence"
		label="Existence"
		:options="existenceOptions"/>
</template>

<script setup lang="ts">
import { computed } from "vue"

import type { OptionInfo } from "$@/types/component"

import SelectableExistence from "@/fields/selectable_radio.vue"

const props = defineProps<{
	"modelValue": string
}>()

interface CustomEvents {
	(event: "update:modelValue", chosenValue: string): void
}
const emit = defineEmits<CustomEvents>()

const existence = computed<string>({
	get(): string { return props.modelValue as string },
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})

const existenceOptions = [
	{
		"label": "Exists",
		"value": "exists"
	},
	{
		"label": "Archived",
		"value": "archived"
	},
	{
		"label": "All",
		"value": "*"
	}
] as OptionInfo[]
</script>
