import helper from "./make_switch"

describe("Helper: Make switch", () => {
	it("can toggle to false", () => {
		const { state, toggle } = helper(true)

		toggle()

		expect(state.value).toBeFalsy()
	})

	it("can toggle to true", () => {
		const { state, toggle } = helper(false)

		toggle()

		expect(state.value).toBeTruthy()
	})

	it("can become false", () => {
		const { state, off } = helper(true)

		off()

		expect(state.value).toBeFalsy()
	})

	it("can become true", () => {
		const { state, on } = helper(false)

		on()

		expect(state.value).toBeTruthy()
	})
})
