import Stub from "$/helpers/singletons/stub"
import assignPath from "./assign_path"

describe("External: Assign path", () => {
	it("can assign", () => {
		const newPath = "/consultation"

		assignPath(newPath)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments.0", newPath)
		expect(previousCalls).not.toHaveProperty("0.arguments.1")
	})
})
