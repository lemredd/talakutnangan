import { Request } from "!/types/dependent"
import Validation from "!/bases/validation"

export default class extends Validation {
	constructor() {
		super({
			"params": [ "required" ],
			"params.id": [ "required", "numeric" ],
			"body": [ "required" ],
			"body.data": [ "required", "object" ],
			"body.data.id": [ "required", "numeric", "same:params.id" ]
		})
	}

	getSubject(request: Request): object {
		return request
	}
}
