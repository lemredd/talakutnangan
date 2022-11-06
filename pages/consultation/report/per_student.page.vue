<template>
	<article>
		<h1>Sum Per Student</h1>
		<SummaryModifier
			:initial-range-begin="rangeBegin"
			:initial-range-end="rangeEnd"
			:semesters="semesters"
			@renew-summary="renewSummary"/>
		<Suspensible :is-loaded="isLoaded">
			<p class="details">
				The table contains the students consulted
				from {{ formatToCompleteFriendlyTime(rangeBegin) }}
				to {{ formatToCompleteFriendlyTime(rangeEnd) }}.
			</p>
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
						<td class="sum-entry-owner">
							{{ studentEntry.name }} <small>({{ studentEntry.email }})</small>
						</td>

						<ul class="consultations">
							<td
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
							</td>
						</ul>
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
						<td class="milliseconds">
							{{ convertToFullTimeString(totalTime) }}
						</td>
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
import type { DeserializedSemesterListDocument } from "$/types/documents/semester"
import type { DeserializedUserListWithTimeConsumedDocument } from "$/types/documents/user"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/consultation"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"
import convertToFullTimeString from "@/consultation/report/convert_to_full_time_string"

import Suspensible from "@/helpers/suspensible.vue"
import SummaryModifier from "@/consultation/report/summary_modifier.vue"

type RequiredExtraProps =
	| "timeConsumedPerStudent"
	| "semesters"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps
const semesters = ref<DeserializedSemesterListDocument>(pageProps.semesters)
const timeConsumedPerStudent = ref<DeserializedUserListWithTimeConsumedDocument>(
	pageProps.timeConsumedPerStudent
)
const currentDate = new Date()
const rangeBegin = ref<Date>(resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1)))
const rangeEnd = ref<Date>(adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1)))
const isLoaded = ref<boolean>(false)

const totalTime = computed<number>(() => {
	const total = timeConsumedPerStudent.value.data.reduce((previousTotal, currentSum) => {
		const newTotal = previousTotal + currentSum.meta.totalMillisecondsConsumed
		return newTotal
	}, 0)

	return total
})

const fetcher = new Fetcher()
async function renewSummary(range: SummaryRange) {
	const correctBegin = resetToMidnight(range.rangeBegin)
	const correctEnd = adjustBeforeMidnightOfNextDay(range.rangeEnd)

	isLoaded.value = false
	await fetcher.readTimeSumPerStudent({
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
		timeConsumedPerStudent.value = body
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
