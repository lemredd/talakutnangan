export default function(initialDate: Date): Date {
	const copiedDate = new Date(initialDate)

	// eslint-disable-next-line no-magic-numbers
	copiedDate.setHours(23, 59, 59, 999)

	return copiedDate
}
