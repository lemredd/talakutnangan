import type { Response } from "$@/types/independent"
import type { RoleQueryParameters } from "$/types/query"
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
		"queryParameters": RoleQueryParameters
	}
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "role")
	}

	constructor() {
		super(RoleFetcher.basePath, RoleFetcher.type)
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
				`${this.type}/count_users?${stringifyQuery({
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
