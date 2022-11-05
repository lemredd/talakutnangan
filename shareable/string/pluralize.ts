import pluralize from "pluralize"

export default function(noun: string, quantity: number): string {
	return pluralize(noun, quantity, true)
}
