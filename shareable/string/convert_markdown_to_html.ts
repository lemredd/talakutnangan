import { Converter } from "showdown"

export default function(raw: string): string {
	const converter = new Converter()
	return converter.makeHtml(raw)
}
