import type {
	ValidationState,
	ValidationConstraints,
	BufferRuleConstraints
} from "!/types/validation"

import isUndefined from "$/helpers/type_guards/is_undefined"
import isPlainObject from "$/helpers/is_plain_object"
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
		typeof value === "object"
		&& isPlainObject(value)
		&& "buffer" in value
		&& value.buffer instanceof Buffer
		&& "info" in value
		&& typeof value.info === "object"
		&& !isUndefined(value.info?.mimeType)
	) {
		const { buffer } = value as { buffer: Buffer }
		if (!(buffer.byteLength <= constraints.buffer.maxSize)) {
			const error = {
				"field": constraints.field,
				"messageMaker": (field: string) => `Field "${field}" must be less than ${
					constraints.buffer?.maxSize
				} bytes.`
			}

			throw error
		}

		if (!constraints.buffer.allowedMimeTypes.includes(value.info.mimeType)) {
			const error = {
				"field": constraints.field,
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
		"messageMaker": (field: string) => `Field "${field}" must be a file.`
	}

	throw error
}
