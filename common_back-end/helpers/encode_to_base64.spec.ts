import { Buffer } from "buffer"
import encodeToBase64 from "./encode_to_base64"

describe("Helper: Encode to base 64", () => {
	it("can encode", () => {
		const object = { a: { b: 1 } }

		const encodedString = encodeToBase64(object)

		expect(encodedString).toEqual(Buffer.from(JSON.stringify(object)).toString("base64url"))
	})
})
