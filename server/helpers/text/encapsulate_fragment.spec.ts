import encapsulateFragment from "./encapsulate_fragment"

describe("Helpers: Encapsulate fragment", () => {
	it("can encapsulate fragment", () => {
		const title = "Hello"
		const styles = "p { color: red }"
		const fragment = "<p>World!</p>"

		const document = encapsulateFragment(title, styles, fragment)

		expect(document).toBe(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/><title>${title}</title><style>${styles.split(" ").join("")}</style></head><body>${fragment}</body></html>`)
	})
})
