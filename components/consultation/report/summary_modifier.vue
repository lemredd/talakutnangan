<template>
	<form @submit.prevent="renewSummary">
		<DateRangePicker
			v-model:range-begin="rangeBegin"
			v-model:range-end="rangeEnd"
			:semesters="semesters"
			class="picker"/>
		<div>
			<input
				type="submit"
				value="Summarize"
				class="summarize-print btn btn-primary"/>
			<button
				type="button"
				class="summarize-print btn btn-primary"
				@click="printPage">
				Print
			</button>
		</div>
	</form>
</template>

<style scoped lang="scss">
	@import "@styles/variables.scss";
	@import "@styles/btn.scss";

	form {
		@apply flex flex-row flex-wrap justify-start items-center;

		> .picker {
			@apply flex-1;
		}

		> div {
			@apply flex-none;
		}
	}

	.summarize-print {
		@apply m-l-5 rounded-0.5rem;
	}

	@media print {
		form {
			display: none;
		}
	}
</style>

<script setup lang="ts">
import { ref } from "vue"

import type { SummaryRange } from "$@/types/component"
import type {
	DeserializedSemesterListDocument
} from "$/types/documents/semester"

import DateRangePicker from "@/helpers/filters/date_range_picker.vue"

const props = defineProps<{
	initialRangeBegin: Date,
	initialRangeEnd: Date,
	semesters: DeserializedSemesterListDocument
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
