import { Buffer } from "buffer"
import type { Validator } from "node-input-validator"

/**
 * Function to validate the uploaded file.
 *
 * Accepts MIME type and size to be compared to the field. This rule must be used after the parsing
 * the body using *!/common_controllers/multipart_controller*.
 */
export default function({ value, args }: { value: any, args: string[] }, validator: Validator) {
	const mimeType = args[0]

	return typeof value === "object"
		&& "buffer" in value
		&& value.buffer instanceof Buffer
		&& "info" in value
		&& typeof value.info === "object"
		&& value.info?.mimeType === mimeType
}
