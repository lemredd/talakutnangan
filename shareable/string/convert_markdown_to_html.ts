import { Converter } from "showdown"

export default function(raw: string): string {
	const converter = new Converter({
		"backslashEscapesHTMLTags": true
	})
	converter.setFlavor("github")
	return converter.makeHtml(raw)
}
