import { ref, computed } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import { CUSTOM_MILLISECONDS_IF_URGENT } from "$/constants/numerical"

import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"

export default function(
	props: {
		"consultation": DeserializedConsultationResource<"consultor"|"consultorRole">
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
	const hasDeleted = computed<boolean>(() => Boolean(props.consultation.deletedAt))

	const willSoonStart = computed<boolean>(
		() => differenceFromSchedule.value > 0 && !hasDeleted.value
	)
	const willStart = computed<boolean>(() => {
		const mayStart = differenceFromSchedule.value === 0 || isAfterScheduledStart.value
		return mayStart && !hasStarted.value && !hasDeleted.value
	})
	const isOngoing = computed<boolean>(() => {
		const isInProgress = isAfterScheduledStart.value && hasStarted.value
		return isInProgress && !hasFinished.value
	})
	const isDone = computed<boolean>(() => {
		const isInProgress = isAfterScheduledStart.value && hasStarted.value
		return isInProgress && hasFinished.value
	})
	const isCanceled = computed<boolean>(() => hasDeleted.value)
	const isAutoTerminated = computed<boolean>(() => {
		const hasTerminated = isAfterScheduledStart.value && !hasDeleted.value
		return hasTerminated && props.consultation.actionTaken === null
	})
	const isUrgent = computed(() => {
		const doesMatchCustomMillisecondsIfUrgent
		= props.consultation.scheduledStartAt.getMilliseconds() === CUSTOM_MILLISECONDS_IF_URGENT

		return doesMatchCustomMillisecondsIfUrgent
	})

	setInterval(() => {
		currentTime.value = new Date()
	}, convertTimeToMilliseconds("00:00:01"))

	return {
		isAutoTerminated,
		isCanceled,
		isDone,
		isOngoing,
		isUrgent,
		willSoonStart,
		willStart
	}
}
