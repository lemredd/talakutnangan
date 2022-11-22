import type {
	ProfanityFilterResourceIdentifier,
	ProfanityFilterAttributes,
	ProfanityFilterResource,
	DeserializedProfanityFilterResource,
	ProfanityFilterDocument,
	ProfanityFilterListDocument,
	DeserializedProfanityFilterDocument,
	DeserializedProfanityFilterListDocument
} from "$/types/documents/profanity_filter"

import { PROFANITY_FILTER_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class ProfanityFilterFetcher extends BaseFetcher<
	ProfanityFilterResourceIdentifier<"read">,
	ProfanityFilterAttributes<"serialized">,
	ProfanityFilterAttributes<"deserialized">,
	ProfanityFilterResource,
	DeserializedProfanityFilterResource,
	ProfanityFilterDocument,
	ProfanityFilterListDocument,
	DeserializedProfanityFilterDocument,
	DeserializedProfanityFilterListDocument
> {
	constructor() {
		super(PROFANITY_FILTER_LINK)
	}
}
