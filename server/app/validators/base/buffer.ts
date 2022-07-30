import type {
	ValidationState,
	ValidationConstraints,
	BufferRuleConstraints
} from "!/types/independent"

import isPlainObject from "$!/helpers/is_plain_object"
import makeDeveloperError from "!/app/validators/make_developer_error"

/**
 * Validator to check if data is a buffer parsed in `!/middlewares/body_parser/multipart.ts`
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<BufferRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.buffer === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	const value = state.value
	if (
		typeof value === "object"
		&& isPlainObject(value)
		&& "buffer" in value
		&& value.buffer instanceof Buffer
		&& (value.buffer as Buffer).byteLength <= constraints.buffer.maxSize
		&& "info" in value
		&& typeof value.info === "object"
		&& value.info?.mimeType !== undefined
		&& constraints.buffer.allowedMimeTypes.includes(value.info.mimeType)
	) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be a file.`
		}
	}
}
