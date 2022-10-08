import type { CommonQueryParameters } from "$/types/query"
import type { ModelCtor } from "%/types/dependent"
import type { SemesterAttributes } from "$/types/documents/semester"

import BaseManager from "%/managers/base"
import Semester from "%/models/semester"

import SemesterTransformer from "%/transformers/semester"

interface RawSemesterAttributes extends SemesterAttributes<"serialized"> {
	userID: number|null
}

export default class extends BaseManager<
	Semester,
	RawSemesterAttributes,
	CommonQueryParameters
> {
	get model(): ModelCtor<Semester> { return Semester }

	get transformer(): SemesterTransformer { return new SemesterTransformer() }
}
