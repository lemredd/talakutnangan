import type { Request } from "!/types/dependent"
import type {
	ValidationState,
	ValidationConstraints,
	IsWithinEmployeeScheduleRuleConstraints
} from "!/types/validation"

import Manager from "%/managers/employee_schedule"
import isUndefined from "$/type_guards/is_undefined"
import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if schedule is within employee schedule.
 *
 * Note: The validator only works for resources with numerical role IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request> & Partial<IsWithinEmployeeScheduleRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.isWithinEmployeeSchedule)) {
		throw makeDeveloperError(constraints.field)
	}

	const manager = new Manager(constraints.request)

	const datetime = state.value

	const userID = Number(accessDeepPath(
		constraints.source,
		constraints.isWithinEmployeeSchedule.userIDPointer
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

	const isInSchedule = await manager.isWithinSchedule(userID, datetime)

	if (isInSchedule) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The "${field}" with a value of "${value}"`
			const predicate = "should be in employee's schedule."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
