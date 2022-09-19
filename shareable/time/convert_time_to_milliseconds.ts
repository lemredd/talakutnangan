import { convertMany } from "convert"

/**
 * Assumes the parameter is a valid time string.
 */
export default function(time: string): number {
	const [ hours, minutes, seconds = 0 ] = time.split(":")
	return convertMany(`${hours}h ${minutes}min ${seconds}s`).to("milliseconds")
}
