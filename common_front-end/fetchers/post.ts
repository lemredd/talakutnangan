import type { Response } from "$@/types/independent"
import type { PostQueryParameters } from "$/types/query"
import type {
	PostResourceIdentifier,
	PostAttributes,
	PostResource,
	DeserializedPostResource,
	PostDocument,
	PostListDocument,
	DeserializedPostDocument,
	DeserializedPostListDocument,
	PostRelationships,
	PostIdentifierListDocument
} from "$/types/documents/post"

import {
	POST_LINK,
	COUNT_COMMENTS,
	UPDATE_TAG_OF_POST_LINK
} from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"
import specializePath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"

export default class PostFetcher extends BaseFetcher<
	PostResourceIdentifier<"read">,
	PostAttributes<"serialized">,
	PostAttributes<"deserialized">,
	PostResource,
	DeserializedPostResource,
	PostDocument,
	PostListDocument,
	DeserializedPostDocument,
	DeserializedPostListDocument,
	{
		"queryParameters": PostQueryParameters<string>,
		"extraCreateData": PostRelationships<"create">,
		"extraUpdateData": PostRelationships<"update">
	}
> {
	constructor() {
		super(POST_LINK)
	}

	countComments(IDs: string[]): Promise<Response<
		PostResourceIdentifier,
		PostAttributes<"serialized">,
		PostAttributes<"deserialized">,
		PostResource,
		DeserializedPostResource,
		PostIdentifierListDocument
	>> {
		return this.handleResponse(
			this.getJSON(
				specializePath(COUNT_COMMENTS, {
					"query": stringifyQuery({
						"filter": {
							IDs
						}
					})
				})
			),
			false
		) as Promise<Response<
			PostResourceIdentifier,
			PostAttributes<"serialized">,
			PostAttributes<"deserialized">,
			PostResource,
			DeserializedPostResource,
			PostIdentifierListDocument
		>>
	}

	async updateAttachedTags(id: string, attachedRoleIDs: string[]): Promise<Response<
		PostResourceIdentifier,
		PostAttributes<"serialized">,
		PostAttributes<"deserialized">,
		PostResource,
		DeserializedPostResource,
		null
	>> {
		return await this.handleResponse(
			this.patchJSON(UPDATE_TAG_OF_POST_LINK, {
				id
			}, {
				"data": attachedRoleIDs.map(roleID => ({
					"id": roleID,
					"type": "role"
				}))
			})
		) as Response<
			PostResourceIdentifier,
			PostAttributes<"serialized">,
			PostAttributes<"deserialized">,
			PostResource,
			DeserializedPostResource,
			null
		>
	}
}
