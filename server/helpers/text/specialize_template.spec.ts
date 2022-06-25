import specializeTemplate from "./specialize_template"

describe("Helpers: Specialize template", () => {
	it("can replace variables", () => {
		const templateContent = "Hello {{ name }}!"
		const variables = { name: "world" }

		const specializedContent = specializeTemplate(templateContent, variables)

		expect(specializedContent).toBe("Hello world!")
	})
})
