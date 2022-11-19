<template>
	<div class="date-selector">
		<label for="selected-date">
			{{ label }}
		</label>
		<input
			id="selected-date"
			v-model="rawDate"
			class="date"
			type="date"/>
	</div>
</template>

<style scoped lang = "scss">
	input.date {
		@apply p-1;
		@apply border border-gray-400;
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import convertToRawDate from "$@/helpers/convert_to_raw_date"

const props = defineProps<{
	label?: string
	modelValue: Date
}>()

const emit = defineEmits<{(e: "update:modelValue", newModelValue: Date): void}>()

const date = computed<Date>({
	"get": () => props.modelValue,
	set(newValues: Date) { emit("update:modelValue", newValues) }
})

const rawDate = computed<string>({
	"get": () => convertToRawDate(date.value),
	set(newValue: string) { date.value = new Date(newValue) }
})
</script>
