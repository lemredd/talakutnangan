import { Request } from "express"
import Validation from "!/bases/validation"

export default class extends Validation {
	getSubject(request: Request): object {
		return request.params
	}
}
