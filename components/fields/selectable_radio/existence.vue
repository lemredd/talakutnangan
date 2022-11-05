<template>
	<SelectableExistence
		v-model="existence"
		title="Existence"
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
		"value": "exists"
	},
	{
		"value": "archived"
	},
	{
		"label": "all",
		"value": "*"
	}
] as OptionInfo[]
</script>
