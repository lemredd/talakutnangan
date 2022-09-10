import type { EmployeeScheduleListDocument } from "$/types/documents/employee_schedule"
import type {
	ValidationState,
	ValidationConstraints,
	UniqueEmployeeScheduleRuleConstraint
} from "!/types/validation"

import accessDeepPath from "$!/helpers/access_deep_path"
import isUndefined from "$/helpers/type_guards/is_undefined"
import EmployeeScheduleManager from "%/managers/employee_schedule"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data does not conflict with existing schedules
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<UniqueEmployeeScheduleRuleConstraint>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.uniqueEmployeeSchedule)) {
		throw makeDeveloperError(constraints.field)
	}

	const { value } = state

	if (value.scheduleStart > value.scheduleEnd) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				unusedField: string,
				unusedValue: string
			) => "Start of schedule should be less than the end of the schedule."
		}
		throw error
	}

	const userID = accessDeepPath(
		constraints.source,
		constraints.uniqueEmployeeSchedule.userIDPointer
	)

	if (userID) {
		const manager = new EmployeeScheduleManager(
			constraints.request.transaction,
			constraints.request.cache
		)
		const foundModels = await manager.list({
			"filter": {
				"day": value.dayName,
				"employeeScheduleRange": "*",
				"existence": "*",
				"user": userID
			},
			"page": {
				// TODO Find the best limit
				"limit": 24,
				"offset": 0
			},
			"sort": [ "dayName" ]
		}) as EmployeeScheduleListDocument

		for (const foundModel of foundModels.data) {
			if (
				// Check if start time is inside an existing schedule.
				// eslint-disable-next-line no-extra-parens
				(
					foundModel.attributes.scheduleStart <= value.scheduleStart
					&& value.scheduleStart < foundModel.attributes.scheduleEnd
				)
				// Check if end time is inside an existing schedule.
				// eslint-disable-next-line no-extra-parens
				|| (
					foundModel.attributes.scheduleEnd < value.scheduleEnd
					&& value.scheduleEnd <= foundModel.attributes.scheduleEnd
				)
				// Check if existing schedule is inside the new schedule.
				// eslint-disable-next-line no-extra-parens
				|| (
					value.scheduleStart <= foundModel.attributes.scheduleStart
					&& foundModel.attributes.scheduleEnd <= value.scheduleEnd
				)
			) {
				const error = {
					"field": constraints.field,
				"friendlyName": constraints.friendlyName,
					"messageMaker": (
						unusedField: string,
						unusedValue: string
					) => "The new schedule should not conflict with the existing schedule."
				}
				throw error
			}
		}

		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			unusedField: string,
			unusedValue: string
		) => "Developer put an invalid user ID pointer."
	}

	throw error
}
