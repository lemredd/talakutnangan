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

export type AuditTrailResource = Resource<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes
>

export interface DeserializedAuditTrailResource extends DeserializedResource<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes
> {
	user: DeserializedUserResource|null
}

export type AuditTrailDocument = ResourceDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	AuditTrailResource
>

export type AuditTrailListDocument = ResourceListDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	AuditTrailResource
>

export type DeserializedAuditTrailDocument = DeserializedResourceDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	DeserializedAuditTrailResource
>

export type DeserializedAuditTrailListDocument = DeserializedResourceListDocument<
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	DeserializedAuditTrailResource
>
