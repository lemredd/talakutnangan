<template>
	<article>
		<h1>Consolidated Summary of Consultations</h1>
		<SummaryModifier
			:initial-range-begin="rangeBegin"
			:initial-range-end="rangeEnd"
			@renew-summary="renewSummary"/>
		<Suspensible :is-loaded="isLoaded">
			<p class="details">
				The page contains the overall consultation summary
				from {{ rangeBegin }} to {{ rangeEnd }}.
			</p>
			<div class="main">
				<section>
					<div
						class="consolidated"
						:title="convertToFullTimeString(totalNumberOfConsumedMilliseconds)">
						<div class="hours">
							<p>
								{{ readableTotalHours }}
							</p>
							<p>
								{{ readableTotalMinutes }}
							</p>
							<p>
								{{ readableTotalSeconds }}
							</p>
						</div>
					</div>
					<small>Time consumed</small>
				</section>
				<section>
					<div>
						<div class="text-8xl">
							{{ totalNumberOfConsulters }}
						</div>
					</div>
					<small> Number of consulters interacted </small>
				</section>
				<section>
					<div>
						<div>
							{{ totalNumberOfConsultations }}
						</div>
					</div>
					<small> Number of consultations performed </small>
				</section>
				<section>
					<div
						class="consolidated"
						:title="convertToFullTimeString(totalNumberOfConsumedMilliseconds)">
						<div class="hours">
							<p>
								{{ readableWeeklyAverageHoursPerConsulter }}
							</p>
							<p>
								{{ readableWeeklyAverageMinutesPerConsulter }}
							</p>
							<p>
								{{ readableWeeklyAverageSecondsPerConsulter }}
							</p>
						</div>
					</div>
					<small>Weekly average per consulter</small>
				</section>
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
	.details {
		@apply mb-5;
	}

	.main {
		@apply flex flex-row flex-wrap justify-around <sm: flex-col place-content-around;

		section {
			@apply flex-initial flex flex-col justify-around items-center;
			@apply border-2px border-solid p-8px text-center min-w-64 min-h-64 m-3;

			div {
				@apply flex-1 text-center h-10 <sm:h-5 break-words m-auto;
				@apply flex flex-col justify-center items-center;

				div {
					@apply flex-1 text-11xl;
				}
			}

			small { @apply flex-initial; }

			.hours {
				@apply text-5xl;
			}
		}
	}
</style>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { SummaryRange, RawFullTimeString } from "$@/types/component"
import type {
	ConsolidatedSummedTimeDocument,
	DateTimeRange
} from "$/types/documents/consolidated_time"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import makeUnique from "$/array/make_unique"
import Fetcher from "$@/fetchers/consultation"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import convertToRawFullTime from "@/consultation/report/convert_to_raw_full_time"
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

interface WeeklySubtotal extends DateTimeRange {
	count: number
	totalMillisecondsConsumed: number
}

const totalNumberOfConsumedMilliseconds = computed<number>(() => weeklySummary.value.reduce(
	(totalMilliseconds, summary) => totalMilliseconds + summary.totalMillisecondsConsumed,
	0
))
const totalNumberOfConsulters = computed<number>(
	() => makeUnique(weeklySummary.value.map(summary => summary.userIDs).flat()).length
)
const totalNumberOfConsultations = computed<number>(
	() => makeUnique(weeklySummary.value.map(summary => summary.consultationIDs).flat()).length
)

const readableTotalTime = computed<RawFullTimeString>(
	() => convertToRawFullTime(totalNumberOfConsumedMilliseconds.value)
)
const readableTotalHours = computed<string>(() => readableTotalTime.value.hourString)
const readableTotalMinutes = computed<string>(() => readableTotalTime.value.minuteString)
const readableTotalSeconds = computed<string>(() => readableTotalTime.value.secondString)

const weeklyAveragePerConsulters = computed<number>(() => {
	const subtotals = weeklySummary.value.map(summary => ({
		"count": summary.userIDs.length,
		"totalMillisecondsConsumed": summary.totalMillisecondsConsumed
	} as WeeklySubtotal))

	const weightedData = subtotals.map(
		subtotal => subtotal.count * subtotal.totalMillisecondsConsumed
	)
	const total = weightedData.reduce((previousTotal, subtotal) => previousTotal + subtotal, 0)
	return total / Math.max(totalNumberOfConsulters.value, 1)
})
const readableWeeklyAverageTimePerConsulter = computed<RawFullTimeString>(
	() => convertToRawFullTime(weeklyAveragePerConsulters.value)
)
const readableWeeklyAverageHoursPerConsulter = computed<string>(
	() => readableWeeklyAverageTimePerConsulter.value.hourString
)
const readableWeeklyAverageMinutesPerConsulter = computed<string>(
	() => readableWeeklyAverageTimePerConsulter.value.minuteString
)
const readableWeeklyAverageSecondsPerConsulter = computed<string>(
	() => readableWeeklyAverageTimePerConsulter.value.secondString
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
