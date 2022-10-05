import Stub from "$/singletons/stub"
import External from "./body_css_classes"

describe("External: Body CSS Classes", () => {
	it("can be constructed", () => {
		const unusedInstance = new External([])

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "constructor")
		expect(previousCalls).toHaveProperty("0.arguments.0", [])
	})

	it("can darken theme", () => {
		const external = new External([])

		external.darken()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "constructor")
		expect(previousCalls).toHaveProperty("0.arguments.0", [])
		expect(previousCalls).toHaveProperty("1.functionName", "darken")
		expect(previousCalls).toHaveProperty("1.arguments", [])
		expect(external.bodyClasses).toStrictEqual([ "dark" ])
	})

	it("can lighten theme", () => {
		const external = new External([ "dark" ])

		external.lighten()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "constructor")
		expect(previousCalls).toHaveProperty("0.arguments.0", [ "dark" ])
		expect(previousCalls).toHaveProperty("1.functionName", "lighten")
		expect(previousCalls).toHaveProperty("1.arguments", [])
		expect(external.bodyClasses).toStrictEqual([])
	})
})
