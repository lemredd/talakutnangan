import type { Serializable } from "$/types/general"
import type { RoleResourceIdentifier } from "$/types/documents/role"
import type { UserResourceIdentifier, UserAttributes } from "$/types/documents/user"
import type { RawBulkDataForStudent, RawBulkDataForEmployee } from "%/types/independent"
import type { Resource, ResourceDocument, MetaDocument } from "$/types/documents/base"

interface LinkedUserResource extends Resource<
	"create",
	UserResourceIdentifier<"create">,
	UserAttributes<"serialized">
> {
	relationships: {
		roles: {
			data: RoleResourceIdentifier[]
		}
	}
}

interface ImportedCSV extends Serializable {
	importedCSV: RawBulkDataForStudent[] | RawBulkDataForEmployee[]
}

export interface ImportUserDocument extends ResourceDocument<
	"create",
	UserResourceIdentifier<"create">,
	UserAttributes<"serialized">,
	LinkedUserResource
>, MetaDocument<ImportedCSV> {}
