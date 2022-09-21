import debounce from "./debounce"

describe("Helper: Debounce", () => {
	it("can delay invocation", () => {
		jest.useFakeTimers()

		const inactivityDuration = 100
		const mockFunction = jest.fn()
		const debouncedFunction = debounce(mockFunction, inactivityDuration)

		debouncedFunction()
		jest.advanceTimersByTime(inactivityDuration / 2)
		debouncedFunction()
		jest.advanceTimersByTime(inactivityDuration / 2)
		debouncedFunction()
		jest.advanceTimersByTime(inactivityDuration)

		expect(mockFunction).toHaveBeenCalled()
	})
})
