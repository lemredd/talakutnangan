<template>
	<article>
		<h1>Consolidated Summary of Consultations</h1>
		<SummaryModifier
			:initial-range-begin="rangeBegin"
			:initial-range-end="rangeEnd"
			@renew-summary="renewSummary"/>
		<Suspensible :is-loaded="isLoaded">
			<p class="details">
				The list contains the overall consultation summary
				from {{ rangeBegin }} to {{ rangeEnd }}.
			</p>
			<div class="main">
				<table>
					<tr class="row">
						<td>
							<div class="consolidated">
								{{ convertToFullTimeString(totalNumberOfConsumedMilliseconds) }}
							</div>
							<small> Time consumed </small>
						</td>
					</tr>
				</table>
				<table>
					<tr class="row">
						<td>
							<div class="consolidated">
								{{ totalNumberOfStudents }}
							</div>
							<small> Number of consulters interacted </small>
						</td>
					</tr>
				</table>
				<table>
					<tr class="row">
						<td>
							<div class="consolidated">
								{{ totalNumberOfConsultations }}
							</div>
							<small> Number of consultations performed </small>
						</td>
					</tr>
				</table>
				<table>
					<tr class="row">
						<td>
							<div class="consolidated">
							</div>
							<small> add name here </small>
						</td>
					</tr>
				</table>
			</div>
		</Suspensible>
	</article>
</template>

<style lang="scss">
	@media print {
		.parent-dropdown-container.links.mobile, .page-shell-footer {
			display: none;
		}
	}
</style>

<style scoped lang="scss">

.main{
	@apply flex justify-around <sm: flex-col place-content-around;
}
.details{
	@apply mb-5;
}

table, td{
	@apply border-2px border-solid p-8px text-center <sm: justify-center w-150 m-10px;

}

.consolidated{
	@apply text-center h-10 <sm: h-5;
}

</style>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { SummaryRange } from "$@/types/component"
import type {
	ConsolidatedSummedTimeDocument,
	DateTimeRange
} from "$/types/documents/consolidated_time"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import makeUnique from "$/array/make_unique"
import Fetcher from "$@/fetchers/consultation"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"
import convertToFullTimeString from "@/consultation/report/convert_to_full_time_string"

import Suspensible from "@/suspensible.vue"
import SummaryModifier from "@/consultation/report/summary_modifier.vue"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedforConsolidation"
>
const { pageProps } = pageContext
const { userProfile } = pageProps
const timeConsumedforConsolidation = ref<ConsolidatedSummedTimeDocument>(
	pageProps.timeConsumedforConsolidation as ConsolidatedSummedTimeDocument
)
const currentDate = new Date()
const rangeBegin = ref<Date>(resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1)))
const rangeEnd = ref<Date>(adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1)))
const isLoaded = ref<boolean>(false)

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
			"beginAt": resetToMidnight(i),
			"endAt": rangeLastEnd
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
		const { beginAt, endAt } = sum

		return range.beginAt <= beginAt && endAt <= range.endAt
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

const fetcher = new Fetcher()
async function renewSummary(range: SummaryRange) {
	const correctBegin = resetToMidnight(range.rangeBegin)
	const correctEnd = adjustBeforeMidnightOfNextDay(range.rangeEnd)

	isLoaded.value = false
	await fetcher.readTimeSumForConsolidation({
		"filter": {
			"dateTimeRange": {
				"begin": correctBegin,
				"end": correctEnd
			},
			"existence": "exists",
			"user": userProfile.data.id
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": 0
		},
		"sort": [ "name" ]
	}).then(({ body }) => {
		timeConsumedforConsolidation.value = body
		rangeBegin.value = correctBegin
		rangeEnd.value = correctEnd
		isLoaded.value = true
	}).catch(() => {
		isLoaded.value = true
	})
}

onMounted(() => {
	isLoaded.value = true
})
</script>
