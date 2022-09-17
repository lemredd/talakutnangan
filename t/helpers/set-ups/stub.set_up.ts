import Stub from "$/singletons/stub"

afterEach(() => {
	// Clear the memory
	const unusedPreviousCalls = Stub.consumePreviousCalls()
})
