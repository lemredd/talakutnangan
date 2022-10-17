import type {
	AsynchronousFileResourceIdentifier,
	AsynchronousFileAttributes,
	AsynchronousFileResource,
	DeserializedAsynchronousFileResource,
	AsynchronousFileDocument,
	AsynchronousFileListDocument,
	DeserializedAsynchronousFileDocument,
	DeserializedAsynchronousFileListDocument
} from "$/types/documents/asynchronous_file"

import { ASYNCHRONOUS_FILE } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class AsynchronousFileFetcher extends BaseFetcher<
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<"serialized">,
	AsynchronousFileAttributes<"deserialized">,
	AsynchronousFileResource,
	DeserializedAsynchronousFileResource,
	AsynchronousFileDocument,
	AsynchronousFileListDocument,
	DeserializedAsynchronousFileDocument,
	DeserializedAsynchronousFileListDocument
> {
	constructor() {
		super(ASYNCHRONOUS_FILE)
	}
}
