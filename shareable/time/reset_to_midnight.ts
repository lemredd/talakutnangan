export default function(initialDate: Date): Date {
	const copiedDate = new Date(initialDate)

	// eslint-disable-next-line no-magic-numbers
	copiedDate.setHours(0, 0, 0, 0)

	return copiedDate
}
