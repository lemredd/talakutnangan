<template>
	<div class="picker">
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
				v-model="rawRangeBegin"
				class="date"/>
		</label>
		<label v-if="mustUseCustomRange">
			<span>
				End:
			</span>
			<DateSelector
				v-model="rawRangeEnd"
				class="date"/>
		</label>
	</div>
</template>

<style scoped lang="scss">
	.picker {
		@apply flex flex-row flex-wrap justify-start items-center;

		label {
			@apply flex-1 flex flex-row justify-start items-center my-2;

			span {
				@apply flex-initial;
			}

			.date {
				@apply flex-1 p-2 bg-gray-300 shadow-inner rounded-0.5rem ml-5 w-50;
			}
		}

		.date-range {
			@apply flex-1 py-2 mr-2;
		}
	}
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

import type { OptionInfo } from "$@/types/component"
import type {
	DeserializedSemesterResource,
	DeserializedSemesterListDocument
} from "$/types/documents/semester"

import DateSelector from "@/fields/date_selector.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"

const props = defineProps<{
	rangeBegin: Date,
	rangeEnd: Date,
	semesters: DeserializedSemesterListDocument
}>()

interface CustomEvents {
	(event: "update:rangeBegin", date: Date): void
	(event: "update:rangeEnd", date: Date): void
}
const emit = defineEmits<CustomEvents>()

const CUSTOM_RANGE = "custom"
const chosenSemester = ref<string>(CUSTOM_RANGE)
const selectableSemesters = computed<OptionInfo[]>(() => [
	...props.semesters.data.map(semester => ({
		"label": semester.name,
		"value": semester.id
	})),
	{
		"label": "Custom range",
		"value": CUSTOM_RANGE
	}
])
const mustUseCustomRange = computed(() => chosenSemester.value === CUSTOM_RANGE)
const rawRangeBegin = computed<Date>({
	get(): Date { return props.rangeBegin },
	set(newDate: Date): void {
		emit("update:rangeBegin", newDate)
	}
})
const rawRangeEnd = computed<Date>({
	get(): Date { return props.rangeEnd },
	set(newDate: Date): void {
		emit("update:rangeEnd", newDate)
	}
})

watch(chosenSemester, newValue => {
	const resource = props.semesters.data
	.find(semester => semester.id === newValue) as DeserializedSemesterResource

	rawRangeBegin.value = resource.startAt
	rawRangeEnd.value = resource.endAt
})
</script>
