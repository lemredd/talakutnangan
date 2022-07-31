import type { Validator } from "node-input-validator"
import accessDeepPath from "$!/helpers/access_deep_path"

import type { BaseManagerClass } from "!/types/independent"

/**
 * Function to validate if the ID in the body is the same as parameter ID.
 *
 * Accepts the path to parameter ID.
 */
export default async function(
	{ value, args }: { value: any, args: any[] },
	validator: Validator
): Promise<boolean> {
	if (value !== undefined) {
		if (args.length < 1) {
			throw new Error("Number of arguments passed to `sameID` rule is insufficient")
		}

		const IDPath = args[0]
		const parameterID = +accessDeepPath(validator.inputs, IDPath)
		const castedValue = +value
		return !Number.isNaN(parameterID) && !Number.isNaN(castedValue) && parameterID === castedValue
	} else {
		// Skip the validation if the field does not exists
		return true
	}
}
