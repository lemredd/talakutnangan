<template>
	<article>
		<h1>Consolidated Summary of Consultations</h1>
		<SummaryModifier
			:initial-range-begin="rangeBegin"
			:initial-range-end="rangeEnd"
			:semesters="semesters"
			@renew-summary="renewSummary"/>
		<Suspensible :is-loaded="isLoaded">
			<p class="details">
				The page contains the overall consultation summary
				from {{ formatToCompleteFriendlyTime(rangeBegin) }}
				to {{ formatToCompleteFriendlyTime(rangeEnd) }}.
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
							{{ totalNumberOfConsultees }}
						</div>
					</div>
					<small> Number of consultees interacted </small>
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
								{{ readableWeeklyAverageHoursPerConsultee }}
							</p>
							<p>
								{{ readableWeeklyAverageMinutesPerConsultee }}
							</p>
							<p>
								{{ readableWeeklyAverageSecondsPerConsultee }}
							</p>
						</div>
					</div>
					<small>Weekly average per consultee</small>
				</section>
				<section>
					<div
						class="consolidated"
						:title="convertToFullTimeString(totalNumberOfConsumedMilliseconds)">
						<div class="hours">
							<p>
								{{ readableWeeklyAverageHoursPerConsultation }}
							</p>
							<p>
								{{ readableWeeklyAverageMinutesPerConsultation }}
							</p>
							<p>
								{{ readableWeeklyAverageSecondsPerConsultation }}
							</p>
						</div>
					</div>
					<small>Weekly average per consultation</small>
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
		@apply flex flex-row flex-wrap justify-center place-content-around;

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
				@apply text-4xl;
			}
		}
	}
</style>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { SummaryRange, RawFullTimeString } from "$@/types/component"
import type { DeserializedSemesterListDocument } from "$/types/documents/semester"
import type {
	ConsolidatedSummedTimeDocument,
	DateTimeRange
} from "$/types/documents/consolidated_time"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import makeUnique from "$/array/make_unique"
import Fetcher from "$@/fetchers/consultation"
import SemesterFetcher from "$@/fetchers/semester"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import convertToRawFullTime from "@/consultation/report/convert_to_raw_full_time"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"
import convertToFullTimeString from "@/consultation/report/convert_to_full_time_string"

import { READ } from "$/permissions/semester_combinations"
import { semester as permissionGroup } from "$/permissions/permission_list"

import Suspensible from "@/helpers/suspensible.vue"
import SummaryModifier from "@/consultation/report/summary_modifier.vue"

type RequiredExtraProps =
	| "timeConsumedforConsolidation"
	| "semesters"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps
const semesters = ref<DeserializedSemesterListDocument>(pageProps.semesters)
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
const totalNumberOfConsultees = computed<number>(
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

const weeklyAveragePerConsultees = computed<number>(() => {
	const subtotals = weeklySummary.value.map(summary => ({
		"count": summary.userIDs.length,
		"totalMillisecondsConsumed": summary.totalMillisecondsConsumed
	} as WeeklySubtotal))

	const weightedData = subtotals.map(
		subtotal => subtotal.count * subtotal.totalMillisecondsConsumed
	)
	const totalWeeklyCount = subtotals.reduce(
		(previousTotal, subtotal) => previousTotal + subtotal.count,
		0
	)
	const total = weightedData.reduce((previousTotal, subtotal) => previousTotal + subtotal, 0)
	return total / Math.max(totalWeeklyCount, 1)
})
const readableWeeklyAverageTimePerConsultee = computed<RawFullTimeString>(
	() => convertToRawFullTime(weeklyAveragePerConsultees.value)
)
const readableWeeklyAverageHoursPerConsultee = computed<string>(
	() => readableWeeklyAverageTimePerConsultee.value.hourString
)
const readableWeeklyAverageMinutesPerConsultee = computed<string>(
	() => readableWeeklyAverageTimePerConsultee.value.minuteString
)
const readableWeeklyAverageSecondsPerConsultee = computed<string>(
	() => readableWeeklyAverageTimePerConsultee.value.secondString
)

const weeklyAveragePerConsultations = computed<number>(() => {
	const subtotals = weeklySummary.value.map(summary => ({
		"count": summary.consultationIDs.length,
		"totalMillisecondsConsumed": summary.totalMillisecondsConsumed
	} as WeeklySubtotal))

	const weightedData = subtotals.map(
		subtotal => subtotal.count * subtotal.totalMillisecondsConsumed
	)
	const totalWeeklyCount = subtotals.reduce(
		(previousTotal, subtotal) => previousTotal + subtotal.count,
		0
	)
	const total = weightedData.reduce((previousTotal, subtotal) => previousTotal + subtotal, 0)
	return total / Math.max(totalWeeklyCount, 1)
})
const readableWeeklyAverageTimePerConsultation = computed<RawFullTimeString>(
	() => convertToRawFullTime(weeklyAveragePerConsultations.value)
)
const readableWeeklyAverageHoursPerConsultation = computed<string>(
	() => readableWeeklyAverageTimePerConsultation.value.hourString
)
const readableWeeklyAverageMinutesPerConsultation = computed<string>(
	() => readableWeeklyAverageTimePerConsultation.value.minuteString
)
const readableWeeklyAverageSecondsPerConsultation = computed<string>(
	() => readableWeeklyAverageTimePerConsultation.value.secondString
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

onMounted(async() => {
	const mayViewSemesters = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		READ
	])

	if (mayViewSemesters) {
		await loadRemainingResource(semesters, new SemesterFetcher(), () => ({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": semesters.value.data.length
			},
			"sort": [ "startAt" ]
		}))
	}

	isLoaded.value = true
})
</script>
