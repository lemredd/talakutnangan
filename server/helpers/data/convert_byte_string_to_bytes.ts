import { convert, Data } from "convert"

export default function(size: string): number {
	const [ unusedSource, value, unit ] = size.match(/(\d+)((M|k)?B)/u) as any[]

	const bytes = convert(
		Number(value),
		unit as Data
	).to("bytes")

	return bytes
}
