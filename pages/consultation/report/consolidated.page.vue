<template>
	<article>
		<h1>Consolidated Summary of Consultations</h1>
		<ul>
			<li>
				<div class="milliseconds">
					<span>Time consumed:</span>
					{{ convertToFullTimeString(totalNumberOfConsumedMilliseconds) }}
				</div>
			</li>
			<li>
				<div class="users">
					<span>Number of consulters interacted:</span>
					{{ totalNumberOfStudents }}
				</div>
			</li>
			<li>
				<div class="users">
					<span>Number of consultations performed:</span>
					{{ totalNumberOfConsultations }}
				</div>
			</li>
		</ul>
	</article>
</template>

<style>

</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	ConsolidatedSummedTimeDocument,
	DateTimeRange
} from "$/types/documents/consolidated_time"

import makeUnique from "$/array/make_unique"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"
import convertToFullTimeString from "@/consultation/report/convert_to_full_time_string"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedforConsolidation"
>
const { pageProps } = pageContext
const timeConsumedforConsolidation = ref<ConsolidatedSummedTimeDocument>(
	pageProps.timeConsumedforConsolidation as ConsolidatedSummedTimeDocument
)
const currentDate = new Date()
const rangeBegin = ref<Date>(resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1)))
const rangeEnd = ref<Date>(adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1)))

const weeklyRangeBegin = computed<Date>(
	() => resetToMidnight(adjustUntilChosenDay(rangeBegin.value, 0, -1))
)
const weeklyRangeEnd = computed<Date>(
	() => adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(rangeEnd.value, 6, 1))
)
const weeklyGroups = computed<DateTimeRange[]>(() => {
	const ranges = []

	let i = weeklyRangeBegin.value
	do {
		const localRangeEnd = adjustUntilChosenDay(i, 6, 6)
		const rangeLastEnd = adjustBeforeMidnightOfNextDay(localRangeEnd)

		ranges.push({
			"beginDateTime": resetToMidnight(i),
			"endDateTime": rangeLastEnd
		})

		i = adjustUntilChosenDay(localRangeEnd, 0, 1)
	} while (i < weeklyRangeEnd.value)

	return ranges
})

interface WeeklySummary extends DateTimeRange {
	userIDs: string[]
	consultationIDs: string[],
	totalMillisecondsConsumed: number
}
const weeklySummary = computed<WeeklySummary[]>(() => weeklyGroups.value.map(range => {
	const metaDocument = timeConsumedforConsolidation.value.meta
	const rawConsolidatedSums = metaDocument.rawConsolidatedTimeSums.filter(sum => {
		const { beginDateTime, endDateTime } = sum

		return range.beginDateTime <= beginDateTime && endDateTime <= range.endDateTime
	}).reduce((summary, currentDay) => ({
		...summary,
		"consultationIDs": [ ...summary.consultationIDs, ...currentDay.consultationIDs ],
		"totalMillisecondsConsumed": summary.totalMillisecondsConsumed
			+ currentDay.totalMillisecondsConsumed,
		"userIDs": [ ...summary.userIDs, ...currentDay.userIDs ]
	}), {
		"consultationIDs": [],
		"totalMillisecondsConsumed": 0,
		"userIDs": [],
		...range
	} as WeeklySummary)

	rawConsolidatedSums.consultationIDs = makeUnique(rawConsolidatedSums.consultationIDs)
	rawConsolidatedSums.userIDs = makeUnique(rawConsolidatedSums.userIDs)

	return rawConsolidatedSums
}))

const totalNumberOfConsumedMilliseconds = computed<number>(() => weeklySummary.value.reduce(
	(totalMilliseconds, summary) => totalMilliseconds + summary.totalMillisecondsConsumed,
	0
))
const totalNumberOfStudents = computed<number>(
	() => makeUnique(weeklySummary.value.map(summary => summary.userIDs).flat()).length
)
const totalNumberOfConsultations = computed<number>(
	() => makeUnique(weeklySummary.value.map(summary => summary.consultationIDs).flat()).length
)
</script>
