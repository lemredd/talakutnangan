import type { ErrorPointer } from "!/types/independent"

export default function(field: string): ErrorPointer {
	return {
		field,
		"messageMaker": (passedField: string) => {
			const message = `Developer forgot to add contraints in object for field ${passedField}.`
			return message
		}
	}
}
