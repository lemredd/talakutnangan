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

export interface AuditTrailResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
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

export interface DeserializedAuditTrailResource<T extends string|number = string>
extends DeserializedResource<
	T,
	AuditTrailResourceIdentifier<T>,
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

export type DeserializedAuditTrailDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	AuditTrailResourceIdentifier<T>,
	AuditTrailAttributes,
	DeserializedAuditTrailResource<T>
>

export type DeserializedAuditTrailListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	AuditTrailResourceIdentifier<T>,
	AuditTrailAttributes,
	DeserializedAuditTrailResource<T>
>
