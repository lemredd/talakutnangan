<template>
	<ul>
		<!-- TODO: correct the entries here -->
		<li
			v-for="sumEntry in totalMillisecondsConsumed.data"
			:key="sumEntry.id">
			<h3 class="sum-entry-owner">
				{{ sumEntry.name }} <small>({{ sumEntry.email }})</small>
			</h3>
			<div class="milliseconds">
				<span>Time consumed:</span>
				{{ convertToFullTimeString(sumEntry.meta.totalMillisecondsConsumed) }}
			</div>
			<ul class="consultations">
				<span>consultations</span>
				<li
					v-for="consultation in sumEntry.meta.consultations.data"
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
		</li>
	</ul>
</template>

<style>

</style>

<script setup lang="ts">
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"

import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"
import convertMStoTimeObject from "$@/helpers/convert_milliseconds_to_full_time_object"

const pageContext = inject("pageContext") as PageContext<
	"deserialized",
	"timeConsumedPerWeek"
>
const { pageProps } = pageContext
const { totalMillisecondsConsumed } = pageProps

function convertToFullTimeString(timeInMilliseconds: number) {
	const {
		hours,
		minutes,
		seconds
	} = convertMStoTimeObject(timeInMilliseconds)

	// eslint-disable-next-line max-len
	return `${Math.abs(hours)} hours ${Math.abs(minutes)} minutes ${Math.abs(Math.floor(seconds))} seconds`
}
</script>
