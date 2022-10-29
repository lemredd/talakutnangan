<template>
	<article>
		<h1>Sum Per Student</h1>
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
import { inject, computed } from "vue"

import type { PageContext } from "$/types/renderer"

import convertToFullTimeString from "@/consultation/convert_to_full_time_string"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedPerStudent"
>
const { pageProps } = pageContext
const { timeConsumedPerStudent } = pageProps

const totalTime = computed<number>(() => {
	const total = timeConsumedPerStudent.data.reduce((previousTotal, currentSum) => {
		const newTotal = previousTotal + currentSum.meta.totalMillisecondsConsumed
		return newTotal
	}, 0)

	return total
})
</script>
