<template>
	<article>
		<h1>Weekly Time Sums</h1>
		<SummaryModifier
			:initial-range-begin="rangeBegin"
			:initial-range-end="rangeEnd"
			@renew-summary="renewSummary"/>
		<p>
			The table contains the weekly consultations from {{ rangeBegin }} to {{ rangeEnd }}.
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
					:key="sumEntry.beginDateTime.toJSON()">
					<td>{{ i+1 }}</td>
					<td>{{ sumEntry.beginDateTime.toJSON() }}</td>
					<td>{{ sumEntry.endDateTime.toJSON() }}</td>
					<td>
						<ul class="consultations">
							<li
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
							</li>
						</ul>
					</td>
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
	</article>
</template>

<style>

</style>

<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { SummaryRange } from "$@/types/component"
import type { WeeklySummedTimeDocument } from "$/types/documents/consolidated_time"

import Fetcher from "$@/fetchers/consultation"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"
import convertToFullTimeString from "@/consultation/report/convert_to_full_time_string"

import SummaryModifier from "@/consultation/report/summary_modifier.vue"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedPerWeek"
>
const { pageProps } = pageContext
const timeConsumedPerWeek = ref<WeeklySummedTimeDocument>(pageProps.timeConsumedPerWeek)
const currentDate = new Date()
const rangeBegin = ref<Date>(resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1)))
const rangeEnd = ref<Date>(adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1)))

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
function renewSummary(range: SummaryRange) {
	// TODO: fetcher method to make consultation summary per week
}
</script>
