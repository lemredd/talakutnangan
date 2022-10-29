<template>
	<article>
		<h1>Weekly Time Sums</h1>
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
							<span>consultations</span>
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
import { inject, computed } from "vue"

import type { PageContext } from "$/types/renderer"

import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"
import convertToFullTimeString from "@/consultation/report/convert_to_full_time_string"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedPerWeek"
>
const { pageProps } = pageContext
const { timeConsumedPerWeek } = pageProps

const totalTime = computed<number>(() => {
	const total = timeConsumedPerWeek.meta.weeklyTimeSums.reduce((previousTotal, currentSum) => {
		const newTotal = previousTotal + currentSum.totalMillisecondsConsumed
		return newTotal
	}, 0)

	return total
})
</script>
