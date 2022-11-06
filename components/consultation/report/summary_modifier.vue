<template>
	<form @submit.prevent="renewSummary">
		<label>
			<span>
				Begin:
			</span>
			<DateSelector
				v-model="rangeBegin"
				class="date"/>
		</label>
		<label>
			<span>
				End:
			</span>
			<DateSelector
				v-model="rangeEnd"
				class="date"/>
		</label>
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

	@media print {
		form {
			@apply hidden;
		}
	}

	form {
		@apply flex flex-row flex-wrap justify-start items-center;

		label {
			@apply flex-1 flex flex-row justify-start items-center;

			span {
				@apply flex-initial;
			}

			.date {
				@apply flex-1 p-2 bg-gray-300 shadow-inner rounded-0.5rem m-l-5 w-50;
			}
		}

		> div {
			@apply flex-none;
		}
	}

	.summarize-print{
		@apply m-l-5 rounded-0.5rem;
	}
</style>

<script setup lang="ts">
import { ref } from "vue"

import type { SummaryRange } from "$@/types/component"

import DateSelector from "@/fields/date_selector.vue"

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
