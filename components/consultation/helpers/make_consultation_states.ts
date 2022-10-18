import { ref, computed } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"

export default function(
	props: {
		"consultation": DeserializedConsultationResource<"consultant"|"consultantRole">
	}
) {
	const currentTime = ref<Date>(new Date())

	const differenceFromSchedule = computed<number>(() => calculateMillisecondDifference(
		props.consultation.scheduledStartAt,
		currentTime.value
	))
	const isAfterScheduledStart = computed<boolean>(() => differenceFromSchedule.value < 0)
	const hasStarted = computed<boolean>(() => props.consultation.startedAt !== null)
	const hasFinished = computed<boolean>(() => props.consultation.finishedAt !== null)
	const hasDeleted = computed<boolean>(() => props.consultation.deletedAt !== null)

	const willSoonStart = computed<boolean>(() => differenceFromSchedule.value > 0)
	const willStart = computed<boolean>(() => {
		const mayStart = differenceFromSchedule.value === 0 || isAfterScheduledStart.value
		return mayStart && !hasStarted.value
	})
	const isOngoing = computed<boolean>(() => {
		const isInProgress = isAfterScheduledStart.value && hasStarted.value
		return isInProgress && !hasFinished.value
	})
	const isDone = computed<boolean>(() => {
		const isInProgress = isAfterScheduledStart.value && hasStarted.value
		return isInProgress && hasFinished.value && hasDeleted.value
	})
	const isCanceled = computed<boolean>(
		() => !isAfterScheduledStart.value && hasDeleted.value
	)
	const isAutoTerminated = computed<boolean>(() => {
		const hasTerminated = isAfterScheduledStart.value && hasDeleted.value
		return hasTerminated && props.consultation.actionTaken === null
	})

	setInterval(() => {
		currentTime.value = new Date()
	}, convertTimeToMilliseconds("00:00:01"))

	return {
		isAutoTerminated,
		isCanceled,
		isDone,
		isOngoing,
		willSoonStart,
		willStart
	}
}
