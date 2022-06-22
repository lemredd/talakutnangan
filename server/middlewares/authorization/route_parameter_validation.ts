import { Request } from "!/types/dependent"
import Validation from "!/bases/validation"

export default class extends Validation {
	getSubject(request: Request): object {
		return request.params
	}
}
