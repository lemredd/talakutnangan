import {
	isNumber,
	isString,
	isBoolean,
	isObject
} from "$/helpers/type_guards/primitives"

describe("Helpers: primitive type guards", () => {
	describe("Number assertion", () => {
		it("Should be truthy", () => {
			const value = 5
			const assertion = isNumber(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = ""
			const assertion = isNumber(value)
			expect(assertion).toBeFalsy()
		})
	})
	describe("String assertion", () => {
		it("Should be truthy", () => {
			const value = ""
			const assertion = isString(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = 1
			const assertion = isString(value)
			expect(assertion).toBeFalsy()
		})
	})
	describe("Boolean assertion", () => {
		it("Should be truthy", () => {
			const value = true
			const assertion = isBoolean(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = ""
			const assertion = isBoolean(value)
			expect(assertion).toBeFalsy()
		})
	})
	describe("Object assertion", () => {
		it("Should be truthy", () => {
			const value = {}
			const assertion = isObject(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = ""
			const assertion = isObject(value)
			expect(assertion).toBeFalsy()
		})
	})
})
