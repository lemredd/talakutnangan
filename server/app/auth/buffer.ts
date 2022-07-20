import { Buffer } from "buffer"
import type { Validator } from "node-input-validator"

/**
 * Function to validate the uploaded file.
 *
 * Accepts MIME type and max size to be compared to the file field. This rule must be used after the
 * parsing the body using *!/common_controllers/multipart_controller*.
 */
export default function({ value, args }: { value: any, args: string[] }, validator: Validator) {
	if (value) {
		if (args.length < 2) {
			throw new Error("Number of arguments passed to `buffer` rule is insufficient")
		}

		const mimeType = args[0]
		const maxSize = Number(args[1])

		if (Number.isNaN(maxSize)) {
			throw new Error("Size parameter of `buffer` rule is not convertible into number")
		}

		return typeof value === "object"
			&& "buffer" in value
			&& value.buffer instanceof Buffer
			&& (value.buffer as Buffer).byteLength <= maxSize
			&& "info" in value
			&& typeof value.info === "object"
			&& value.info?.mimeType === mimeType
	} else {
		// Skip the validation if the field is nullable
		return true
	}
}
