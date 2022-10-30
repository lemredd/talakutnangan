<template>
	<form @submit.prevent="renewSummary">
		<label>
			Begin:
			<input
				v-model="currentRangeBegin"
				type="date"/>
		</label>
		<label>
			End:
			<input
				v-model="currentRangeEnd"
				type="date"/>
		</label>
		<input type="submit" value="Summarize"/>
	</form>
</template>
<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
	rangeBegin: Date,
	rangeEnd: Date
}>()

interface CustomEvents {
	(event: "renewSummary", range: { rangeBegin: Date, rangeEnd: Date }): void
}
const emit = defineEmits<CustomEvents>()

const currentRangeBegin = ref<Date>(props.rangeBegin)
const currentRangeEnd = ref<Date>(props.rangeEnd)

function renewSummary() {
	emit("renewSummary", {
		"rangeBegin": currentRangeBegin.value,
		"rangeEnd": currentRangeEnd.value
	})
}
</script>
