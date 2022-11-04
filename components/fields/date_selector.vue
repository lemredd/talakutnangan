<template>
	<input
		v-model="rawDate"
		class="date"
		type="date"/>
</template>

<style scoped lang = "scss">
	.date{
		@apply bg-transparent mr-2;
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import convertToRawDate from "$@/helpers/convert_to_raw_date"

const props = defineProps<{
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
