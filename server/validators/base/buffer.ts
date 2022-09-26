import type {
	ValidationState,
	ValidationConstraints,
	BufferRuleConstraints
} from "!/types/validation"

import isPlainObject from "$/type_guards/is_plain_object"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is a buffer parsed in `!/middlewares/body_parser/multipart.ts`
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<BufferRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.buffer)) {
		throw makeDeveloperError(constraints.field)
	}

	const { value } = state
	if (
		isPlainObject(value)
		&& "buffer" in value
		&& value.buffer instanceof Buffer
		&& "info" in value
		&& isPlainObject(value.info)
		&& !isUndefined(value.info?.mimeType)
	) {
		const castBuffer = value.buffer as Buffer
		if (!(castBuffer.byteLength <= constraints.buffer.maximumSize)) {
			const error = {
				"field": constraints.field,
				"friendlyName": constraints.friendlyName,
				"messageMaker": (field: string) => `Field "${field}" must be less than ${
					constraints.buffer?.maximumSize
				} bytes.`
			}

			throw error
		}

		if (!constraints.buffer.allowedMimeTypes.includes(value.info.mimeType)) {
			const error = {
				"field": constraints.field,
				"friendlyName": constraints.friendlyName,
				"messageMaker": (field: string) => `Field "${field}" must be one of the media types: ${
					constraints.buffer?.allowedMimeTypes.join(", ")
				}.`
			}

			throw error
		}

		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" must be a file.`
	}

	throw error
}
