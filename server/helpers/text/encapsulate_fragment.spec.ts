import encapsulateFragment from "./encapsulate_fragment"

describe("Helpers: Encapsulate fragment", () => {
	it("can encapsulate fragment", async () => {
		const title = "Hello"
		const styles = "p { color: red }"
		const fragment = "<p>World!</p>"

		const document = await encapsulateFragment(title, styles, fragment)

		expect(document).toContain(`<title>${title}</title>`)
		expect(document).toContain("p{color:red}")
		expect(document).toContain(fragment)
	})
})
