import type { TagQueryParameters } from "$/types/query"
import type {
	TagResourceIdentifier,
	TagAttributes,
	TagResource,
	DeserializedTagResource,
	TagDocument,
	TagListDocument,
	DeserializedTagDocument,
	DeserializedTagListDocument
} from "$/types/documents/tag"

import { TAG_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class TagFetcher extends BaseFetcher<
	TagResourceIdentifier<"read">,
	TagAttributes<"serialized">,
	TagAttributes<"deserialized">,
	TagResource,
	DeserializedTagResource,
	TagDocument,
	TagListDocument,
	DeserializedTagDocument,
	DeserializedTagListDocument,
	{
		"queryParameters": TagQueryParameters
	}
> {
	constructor() {
		super(TAG_LINK)
	}
}
