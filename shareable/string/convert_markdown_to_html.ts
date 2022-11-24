import { Converter } from "showdown"

export default function(raw: string): string {
	const converter = new Converter({
		"backslashEscapesHTMLTags": true,
		"completeHTMLDocument": false
	})
	converter.setFlavor("github")
	return converter.makeHtml(raw)
}
