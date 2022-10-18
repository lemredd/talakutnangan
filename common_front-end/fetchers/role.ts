import type { Response } from "$@/types/independent"
import type { RoleQueryParameters } from "$/types/query"
import type { RequirePassword } from "$/types/documents/security"
import type {
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource,
	DeserializedRoleResource,
	RoleDocument,
	RoleListDocument,
	DeserializedRoleDocument,
	DeserializedRoleListDocument,
	RoleIdentifierListDocument
} from "$/types/documents/role"

import { ROLE_LINK } from "$/constants/template_links"
import BaseFetcher from "$@/fetchers/base"
import stringifyQuery from "$@/fetchers/stringify_query"

export default class RoleFetcher extends BaseFetcher<
	RoleResourceIdentifier,
	RoleAttributes<"serialized">,
	RoleAttributes<"deserialized">,
	RoleResource,
	DeserializedRoleResource,
	RoleDocument,
	RoleListDocument,
	DeserializedRoleDocument,
	DeserializedRoleListDocument,
	{
		"queryParameters": RoleQueryParameters,
		"extraUpdateData": RequirePassword
	}
> {
	constructor() {
		super(ROLE_LINK)
	}

	countUsers(IDs: string[]): Promise<Response<
		RoleResourceIdentifier<"read">,
		RoleAttributes<"serialized">,
		RoleAttributes<"deserialized">,
		RoleResource,
		DeserializedRoleResource,
		RoleIdentifierListDocument<"read">
	>> {
		return this.handleResponse(
			this.getJSON(
				`${this.links.unbound}/count_users?${stringifyQuery({
					"filter": {
						IDs
					}
				})}`
			),
			false
		) as Promise<Response<
			RoleResourceIdentifier<"read">,
			RoleAttributes<"serialized">,
			RoleAttributes<"deserialized">,
			RoleResource,
			DeserializedRoleResource,
			RoleIdentifierListDocument<"read">
		>>
	}
}
