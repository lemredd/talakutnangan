import type { Request } from "!/types/dependent"
import type { SourceType } from "!/types/independent"
import Validation from "!/bases/validation"

export default class extends Validation {
	getSubject(request: Request): object {
		return request.query
	}

	get sourceType(): SourceType { return "parameter" }
}
