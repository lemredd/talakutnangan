import type { ErrorPointer } from "!/types/independent"

export default function(field: string, errors: (ErrorPointer|Error)[]): ErrorPointer[] {
	return errors.map(error => {
		if (error instanceof Error) {
			return {
				field,
				messageMaker: (
					field: string,
					value: any
				): string => `Unexpected error happened while validating ${field}`
			}
		} else {
			return error
		}
	})
}
