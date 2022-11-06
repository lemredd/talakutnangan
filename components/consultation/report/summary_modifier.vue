<template>
	<form @submit.prevent="renewSummary">
		<SelectableOptionsField
			v-model="chosenSemester"
			class="date-range"
			label="Date range:"
			:options="selectableSemesters"/>
		<label v-if="mustUseCustomRange">
			<span>
				Begin:
			</span>
			<DateSelector
				v-model="rangeBegin"
				class="date"/>
		</label>
		<label v-if="mustUseCustomRange">
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
				@apply flex-1 p-2 bg-gray-300 shadow-inner rounded-0.5rem ml-5 w-50;
			}
		}

		.date-range {
			@apply flex-1 py-2 mr-5;
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
import { ref, computed } from "vue"

import type { SummaryRange, OptionInfo } from "$@/types/component"

import DateSelector from "@/fields/date_selector.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"

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
const CUSTOM_DATE = "custom"
const chosenSemester = ref<string>(CUSTOM_DATE)
const selectableSemesters = computed<OptionInfo[]>(() => [
	{
		"label": "Custom date",
		"value": CUSTOM_DATE
	}
])
const mustUseCustomRange = computed(() => chosenSemester.value === CUSTOM_DATE)

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
