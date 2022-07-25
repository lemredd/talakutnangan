import type { ErrorPointer } from "!/types/independent"

export default function(field: string): ErrorPointer {
	return {
		field: field,
		messageMaker: (field: string) =>
			`Developer forgot to add contraints in object for field ${field}.`
	}
}
