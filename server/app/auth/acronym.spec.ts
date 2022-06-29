import type { Validator } from "node-input-validator"
import acronym from "./acronym"

describe("Validator: Acronym", () => {
	it("can validate normal acronym", () => {
		const validator = {
			inputs: {
				source: "Abc Defgh"
			}
		}
		const value = "AD"
		const args = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("can invalidate normal acronym", () => {
		const validator = {
			inputs: {
				source: "Abc Defgh"
			}
		}
		const value = "AE"
		const args = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("can validate special acronym", () => {
		const validator = {
			inputs: {
				source: "Abc Defgh"
			}
		}
		const value = "AbDe"
		const args = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("can invalidate special acronym", () => {
		const validator = {
			inputs: {
				source: "Abc Defgh"
			}
		}
		const value = "AcDf"
		const args = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("can validate acronym with special characters", () => {
		const validator = {
			inputs: {
				source: "Én Ñe"
			}
		}
		const value = "ÉÑ"
		const args = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("can validate acronym with special characters", () => {
		const validator = {
			inputs: {
				source: "Én Ñe"
			}
		}
		const value = "ÉÑ"
		const args = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("can ignore words that start small", () => {
		const validator = {
			inputs: {
				source: "Abc of Defgh"
			}
		}
		const value = "AbDe"
		const args = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("should error on missing source name", () => {
		const validator = {
			inputs: {
				source: "Abc Def"
			}
		}
		const value = "AbDe"
		const args: string[] = []

		expect(() => acronym({ value, args }, validator as Validator)).toThrow()
	})

	it("can invalidate uneven word-letter ratio of source and acronym", () => {
		const validator = {
			inputs: {
				source: "abc Def"
			}
		}
		const value = "AD"
		const args: string[] = [ "source" ]

		const isValid = acronym({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})
})
