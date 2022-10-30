<template>
	<form @submit.prevent="renewSummary">
		<label>
			Begin:
			<input
				v-model="rangeBegin"
				type="date"/>
		</label>
		<label>
			End:
			<input
				v-model="rangeEnd"
				type="date"/>
		</label>
		<input type="submit" value="Summarize"/>
		<button type="button" @click="printPage">
			Print
		</button>
	</form>
</template>
<script setup lang="ts">
import { ref } from "vue"

import type { SummaryRange } from "$@/types/component"

const props = defineProps<{
	initialRangeBegin: Date,
	initialRangeEnd: Date
}>()

interface CustomEvents {
	(event: "renewSummary", range: SummaryRange): void
}
const emit = defineEmits<CustomEvents>()

const rangeBegin = ref<Date>(props.initialRangeBegin)
const rangeEnd = ref<Date>(props.initialRangeEnd)

function renewSummary() {
	emit("renewSummary", {
		"rangeBegin": rangeBegin.value,
		"rangeEnd": rangeEnd.value
	})
}

function printPage() {
	window.print()
}
</script>
