import type {
	SemesterResourceIdentifier,
	SemesterAttributes,
	SemesterResource,
	DeserializedSemesterResource,
	SemesterDocument,
	SemesterListDocument,
	DeserializedSemesterDocument,
	DeserializedSemesterListDocument
} from "$/types/documents/semester"

import { SEMESTER_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class SemesterFetcher extends BaseFetcher<
	SemesterResourceIdentifier<"read">,
	SemesterAttributes<"serialized">,
	SemesterAttributes<"deserialized">,
	SemesterResource,
	DeserializedSemesterResource,
	SemesterDocument,
	SemesterListDocument,
	DeserializedSemesterDocument,
	DeserializedSemesterListDocument
> {
	constructor() {
		super(SEMESTER_LINK)
	}
}
