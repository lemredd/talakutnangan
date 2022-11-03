<template>
	<article>
		<h1>Weekly Time Sums</h1>
		<SummaryModifier
			:initial-range-begin="rangeBegin"
			:initial-range-end="rangeEnd"
			@renew-summary="renewSummary"/>

		<Suspensible :is-loaded="isLoaded">
			<p class="details">
				The table contains the weekly consultations
				from {{ formatToCompleteFriendlyTime(rangeBegin) }}
				to {{ formatToCompleteFriendlyTime(rangeEnd) }}.
			</p>
			<table>
				<thead>
					<tr>
						<td>Week #</td>
						<td>Begin Date</td>
						<td>End Date</td>
						<td>Consultations</td>
						<td>Total time consumed</td>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(sumEntry, i) in timeConsumedPerWeek.meta.weeklyTimeSums"
						:key="sumEntry.beginAt.toJSON()">
						<td>{{ i+1 }}</td>
						<td>{{ sumEntry.beginAt.toJSON() }}</td>
						<td>{{ sumEntry.endAt.toJSON() }}</td>

						<ul class="consultations">
							<td
								v-for="consultation in sumEntry.consultations.data"
								:key="consultation.id"
								class="consultation">
								#{{ consultation.id }}
								{{ consultation.reason }}
								{{
									convertToFullTimeString(
										calculateMillisecondDifference(
											consultation.finishedAt!,
											consultation.startedAt!
										)
									)
								}}
							</td>
						</ul>

						<td>
							{{ convertToFullTimeString(sumEntry.totalMillisecondsConsumed) }}
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="4">
							Total
						</td>
						<td>{{ convertToFullTimeString(totalTime) }}</td>
					</tr>
				</tfoot>
			</table>
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

	table, th, thead, tfoot, td {
		border:2px solid;
		padding: 8px;
		text-align: center;

	}
	.consultations {
		@apply flex flex-col;
	}
</style>

<script setup lang="ts">
import { inject, ref, computed, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { SummaryRange } from "$@/types/component"
import type { WeeklySummedTimeDocument } from "$/types/documents/consolidated_time"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/consultation"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"
import convertToFullTimeString from "@/consultation/report/convert_to_full_time_string"

import Suspensible from "@/suspensible.vue"
import SummaryModifier from "@/consultation/report/summary_modifier.vue"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedPerWeek"
>
const { pageProps } = pageContext
const { userProfile } = pageProps
const timeConsumedPerWeek = ref<WeeklySummedTimeDocument>(pageProps.timeConsumedPerWeek)
const currentDate = new Date()
const rangeBegin = ref<Date>(resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1)))
const rangeEnd = ref<Date>(adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1)))
const isLoaded = ref<boolean>(false)

const totalTime = computed<number>(() => {
	const total = timeConsumedPerWeek.value.meta.weeklyTimeSums.reduce(
		(previousTotal, currentSum) => {
			const newTotal = previousTotal + currentSum.totalMillisecondsConsumed
			return newTotal
		},
		0
	)

	return total
})

const fetcher = new Fetcher()
async function renewSummary(range: SummaryRange) {
	const correctBegin = resetToMidnight(adjustUntilChosenDay(range.rangeBegin, 0, -1))
	const correctEnd = adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(range.rangeEnd, 6, 1))

	isLoaded.value = false
	await fetcher.readTimeSumPerWeek({
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
		"sort": [ "id" ]
	}).then(({ body }) => {
		timeConsumedPerWeek.value = body
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
