import convertMarkdownToHTML from "./convert_markdown_to_html"

describe("Helpers: Convert Markdown to HTML", () => {
	it("can convert", () => {
		const raw = "# hello world"

		const html = convertMarkdownToHTML(raw)

		expect(html).toBe("<h1 id=\"helloworld\">hello world</h1>")
	})
})
