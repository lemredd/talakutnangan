<template>
	<article>
		<h1>Sum Per Student</h1>
		<p>The table contains the students consulted from {{ rangeBegin }} to {{ rangeEnd }}.</p>
		<table>
			<thead>
				<tr>
					<td>Student ID</td>
					<td>Student</td>
					<td>Consultations</td>
					<td>Total time consumed</td>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="studentEntry in timeConsumedPerStudent.data"
					:key="studentEntry.id">
					<td>{{ studentEntry.id }}</td>
					<td>
						<span>{{ studentEntry.name }}</span>
						<small>({{ studentEntry.email }})</small>
					</td>
					<td>
						<ul class="consultations">
							<span>consultations</span>
							<li
								v-for="consultation in studentEntry.meta.consultations.data"
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
						{{ convertToFullTimeString(studentEntry.meta.totalMillisecondsConsumed) }}
					</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="3">
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
import type { DeserializedUserListWithTimeConsumedDocument } from "$/types/documents/user"

import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import convertToFullTimeString from "@/consultation/convert_to_full_time_string"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedPerStudent"
>
const { pageProps } = pageContext
const timeConsumedPerStudent = ref<DeserializedUserListWithTimeConsumedDocument>(
	pageProps.timeConsumedPerStudent as DeserializedUserListWithTimeConsumedDocument
)
const currentDate = new Date()
const rangeBegin = ref<Date>(resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1)))
const rangeEnd = ref<Date>(adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1)))

const totalTime = computed<number>(() => {
	const total = timeConsumedPerStudent.value.data.reduce((previousTotal, currentSum) => {
		const newTotal = previousTotal + currentSum.meta.totalMillisecondsConsumed
		return newTotal
	}, 0)

	return total
})
</script>
