import type { ErrorPointer } from "!/types/independent"
import RequestEnvironment from "$/singletons/request_environment"

export default function(field: string, errors: (ErrorPointer|Error)[]): ErrorPointer[] {
	return errors.map(error => {
		if (error instanceof Error) {
			return {
				field,
				"messageMaker": (subfield: string): string => {
					let message = `Unexpected error happened while validating ${subfield}.`
					if (RequestEnvironment.isNotOnProduction) {
						message += `Message: ${error.message} ${error.stack})`
					}
					return message
				}
			}
		}
		return error
	})
}
