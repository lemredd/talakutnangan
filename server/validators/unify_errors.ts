import type { ErrorPointer } from "!/types/independent"
import RequestEnvironment from "$/singletons/request_environment"

export default function(field: string, errors: (ErrorPointer|Error)[]): ErrorPointer[] {
	return errors.map(error => {
		if (error instanceof Error) {
			return {
				field,
				messageMaker: (
					field: string,
					value: any
				): string => {
					let message = `Unexpected error happened while validating ${field}.`
					if (RequestEnvironment.isNotOnProduction) {
						message += `Message: ${error.message} ${error.stack})`
					}
					return message
				}
			}
		} else {
			return error
		}
	})
}
