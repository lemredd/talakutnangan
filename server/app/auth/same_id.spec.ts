import type { Validator } from "node-input-validator"
import sameID from "./same_id"

describe("Validator: Same ID", () => {
	it("can accept valid info", async () => {
		const validator = {
			inputs: {
				params: {
					id: "4"
				}
			}
		}
		const value = 4
		const args = [ "params.id" ]

		const isValid = await sameID({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("cannot accept different ID", async () => {
		const validator = {
			inputs: {
				params: {
					id: "5"
				}
			}
		}
		const value = 4
		const args = [ "params.id" ]

		const isValid = await sameID({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("should error on insufficient arguments", () => {
		const validator = {}
		const value = null
		const args: any[] = []

		expect(() => sameID({ value, args }, validator as Validator)).rejects.toThrow()
	})
})
