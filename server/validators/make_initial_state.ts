import type { ValidationState } from "!/types/validation"

export default function(value: any): ValidationState {
	return {
		value,
		maySkip: false
	}
}
