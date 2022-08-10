import type { GeneralObject } from "$/types/general"
import type { DeserializedUserResource } from "$/types/documents/user"
import type {
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface AuditTrailResourceIdentifier extends ResourceIdentifier {
	type: "audit_trail"
}

export interface AuditTrailAttributes extends Attributes {
	actionName: string,
	extra: GeneralObject
}

export interface AuditTrailResource extends Resource<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes
> {}

export interface DeserializedAuditTrailResource extends DeserializedResource<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes
> {
	user: DeserializedUserResource|null
}

export interface AuditTrailDocument extends ResourceDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	AuditTrailResource
> {}

export interface AuditTrailListDocument extends ResourceListDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	AuditTrailResource
> {}

export interface DeserializedAuditTrailDocument extends DeserializedResourceDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	DeserializedAuditTrailResource
> {}

export interface DeserializedAuditTrailListDocument extends DeserializedResourceListDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	DeserializedAuditTrailResource
> {}
