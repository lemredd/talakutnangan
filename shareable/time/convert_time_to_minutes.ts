import { convertMany } from "convert"

/**
 * Assumes the argument is a valid time string.
 */
export default function(time: string): number {
	const [ hours, minutes ] = time.split(":")
	return convertMany(`${hours}h ${minutes}min`).to("minutes")
}
