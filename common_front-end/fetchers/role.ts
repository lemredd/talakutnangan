import type { Serializable } from "$/types/general"
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
	RoleAttributes,
	RoleResource,
	DeserializedRoleResource,
	RoleDocument,
	RoleListDocument,
	DeserializedRoleDocument,
	DeserializedRoleListDocument,
	Serializable,
	RoleQueryParameters
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "role")
	}

	constructor() {
		super(RoleFetcher.basePath, RoleFetcher.type)
	}

	countUsers(IDs: number[]): Promise<Response<
		RoleResourceIdentifier,
		RoleAttributes,
		RoleResource,
		DeserializedRoleResource,
		RoleIdentifierListDocument
	>> {
		return this.handleResponse(
			this.getJSON(
				`${this.type}/count_users?${stringifyQuery({
					filter: {
						IDs
					}
				})}`
			),
			false
		) as Promise<Response<
			RoleResourceIdentifier,
			RoleAttributes,
			RoleResource,
			DeserializedRoleResource,
			RoleIdentifierListDocument
		>>
	}
}
