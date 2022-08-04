import { Buffer } from "buffer"

/**
 * Helper function to encode an object into base64 encoding.
 */
export default function(value: object): string {
	return Buffer.from(JSON.stringify(value)).toString("base64url")
}
