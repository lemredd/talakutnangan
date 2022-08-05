import type { RoleResourceIdentifier } from "$/types/documents/role"
import type { Resource, RawResourceDocument } from "$/types/documents/base"
import type { UserResourceIdentifier, UserAttributes } from "$/types/documents/user"
import type { RawBulkDataForStudent, RawBulkDataForEmployee } from "%/types/independent"

type PartialUserAttributes = Pick<UserAttributes, "kind">

interface LinkedUserResource extends Resource<UserResourceIdentifier, PartialUserAttributes> {
	relationships: {
		roles: {
			data: RoleResourceIdentifier[]
		}
	}
}

export interface ImportUserDocument extends RawResourceDocument<
	UserResourceIdentifier,
	PartialUserAttributes,
	LinkedUserResource
> {
	meta: {
		importedCSV: RawBulkDataForStudent[] | RawBulkDataForEmployee[]
	}
}
