import type { Serializable } from "$/types/general"
import type { RoleResourceIdentifier } from "$/types/documents/role"
import type { UserResourceIdentifier, UserAttributes } from "$/types/documents/user"
import type { RawBulkDataForStudent, RawBulkDataForEmployee } from "%/types/independent"
import type { Resource, RawResourceDocument, MetaDocument } from "$/types/documents/base"

type PartialUserAttributes = Pick<UserAttributes, "kind">

interface LinkedUserResource extends Resource<UserResourceIdentifier, PartialUserAttributes> {
	relationships: {
		roles: {
			data: RoleResourceIdentifier[]
		}
	}
}

interface ImportedCSV extends Serializable {
	importedCSV: RawBulkDataForStudent[] | RawBulkDataForEmployee[]
}

export interface ImportUserDocument extends RawResourceDocument<
	UserResourceIdentifier,
	PartialUserAttributes,
	LinkedUserResource
>, MetaDocument<ImportedCSV> {}
