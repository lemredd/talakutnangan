import type { Serializable } from "$/types/general"
import type { RoleQueryParameters } from "$/types/query"
import type {
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource,
	DeserializedRoleResource,
	RoleDocument,
	RoleListDocument,
	DeserializedRoleDocument,
	DeserializedRoleListDocument
} from "$/types/documents/role"
import BaseFetcher from "$@/fetchers/base"

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
}
