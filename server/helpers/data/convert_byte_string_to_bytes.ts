import { convert, Data } from "convert"

export default function(size: string): number {
	const [ unusedSource, value, unit ] = size.match(/(\d+)(MB|kB)/u) as any[]

	const bytes = convert(
		Number(value),
		unit as Data
	).to("bytes")

	return bytes
}
