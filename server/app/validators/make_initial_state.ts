import type { ValidationState } from "!/types/independent"

export default function(value: any): ValidationState {
	return {
		value,
		maySkip: false
	}
}
