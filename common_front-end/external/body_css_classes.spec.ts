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

	it("can disable scroll on dark theme", () => {
		const external = new External([ "dark" ])

		external.scroll(false)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "constructor")
		expect(previousCalls).toHaveProperty("0.arguments.0", [ "dark" ])
		expect(previousCalls).toHaveProperty("1.functionName", "scroll")
		expect(previousCalls).toHaveProperty("1.arguments.0", [ false ])
		expect(external.bodyClasses).toStrictEqual([ "dark", "unscrollable" ])
	})

	it("can disable scroll on light theme", () => {
		const external = new External([])

		external.scroll(false)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "constructor")
		expect(previousCalls).toHaveProperty("0.arguments.0", [])
		expect(previousCalls).toHaveProperty("1.functionName", "scroll")
		expect(previousCalls).toHaveProperty("1.arguments.0", [ false ])
		expect(external.bodyClasses).toStrictEqual([ "unscrollable" ])
	})

	it("can enable scroll on dark theme", () => {
		const external = new External([ "dark", "unscrollable" ])

		external.scroll(true)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "constructor")
		expect(previousCalls).toHaveProperty("0.arguments.0", [ "dark" ])
		expect(previousCalls).toHaveProperty("1.functionName", "scroll")
		expect(previousCalls).toHaveProperty("1.arguments.0", [ true ])
		expect(external.bodyClasses).toStrictEqual([ "dark" ])
	})

	it("can enable scroll on light theme", () => {
		const external = new External([ "unscrollable" ])

		external.scroll(true)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "constructor")
		expect(previousCalls).toHaveProperty("0.arguments.0", [])
		expect(previousCalls).toHaveProperty("1.functionName", "scroll")
		expect(previousCalls).toHaveProperty("1.arguments.0", [ true ])
		expect(external.bodyClasses).toStrictEqual([])
	})
})
