import type {
	ValidationState,
	ValidationConstraints,
	BufferRuleConstraints
} from "!/types/validation"

import isPlainObject from "$/type_guards/is_object"
import makeDeveloperError from "!/validators/make_developer_error"

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
		&& "info" in value
		&& typeof value.info === "object"
		&& value.info?.mimeType !== undefined
	) {
		if (!((value.buffer as Buffer).byteLength <= constraints.buffer.maxSize)) {
			throw {
				field: constraints.field,
				messageMaker: (field: string) => `Field "${field}" must be less than ${
					constraints.buffer?.maxSize
				} bytes.`
			}
		}

		if (!(constraints.buffer.allowedMimeTypes.includes(value.info.mimeType))) {
			throw {
				field: constraints.field,
				messageMaker: (field: string) => `Field "${field}" must be one of the media types: ${
					constraints.buffer?.allowedMimeTypes.join(", ")
				}.`
			}
		}

		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be a file.`
		}
	}
}
