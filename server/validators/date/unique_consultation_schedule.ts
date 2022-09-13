import type { Request } from "!/types/dependent"
import type { ConsultationListDocument } from "$/types/documents/consultation"
import type {
	ValidationState,
	ValidationConstraints,
	UniqueConsultationScheduleConstraints
} from "!/types/validation"

import Manager from "%/managers/consultation"
import accessDeepPath from "$!/helpers/access_deep_path"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if a consultation schedule is unique.
 *
 * Assumes value to be a `Date`.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request> & Partial<UniqueConsultationScheduleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.uniqueConsultationSchedule)) {
		throw makeDeveloperError(constraints.field)
	}

	const target = state.value as Date
	const ESTIMATED_CONSULTATION_MINUTE_DURATION = 5
	const minimumPossiblePreviousSchedule = new Date(target)
	minimumPossiblePreviousSchedule.setMinutes(
		minimumPossiblePreviousSchedule.getMinutes() - ESTIMATED_CONSULTATION_MINUTE_DURATION
	)

	const manager = new Manager(
		constraints.request.transaction,
		constraints.request.cache
	)

	const userID = Number(accessDeepPath(
		constraints.source, constraints.uniqueConsultationSchedule.userIDPointer
	))

	if (Number.isNaN(userID)) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				field: string,
				value: string
			) => `The "${field}" with a value of "${value}" should be a numeric ID.`
		}

		throw error
	}

	const foundModels = await manager.list({
		"filter": {
			"consultationScheduleRange": {
				"end": target,
				"start": minimumPossiblePreviousSchedule
			},
			"existence": "exists",
			"user": userID
		},
		"page": {
			"limit": 1,
			"offset": 0
		},
		"sort": [ "scheduledStartAt" ]
	}) as ConsultationListDocument

	if (foundModels.data.length === 0) {
		return state
	}

	const mayAllowConflict = Boolean(
		accessDeepPath(
			constraints.source,
			constraints.uniqueConsultationSchedule.conflictConfirmationPointer
		)
	)

	if (mayAllowConflict) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => `The "${field}" with a value of "${value}" conflicts with existing schedules.`
	}

	throw error
}
