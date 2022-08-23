import type { GeneralObject } from "$/types/general"
import type { DeserializedUserResource } from "$/types/documents/user"
import type {
	Completeness,
	Format,
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface AuditTrailResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "audit_trail"
}

export interface AuditTrailAttributes<T extends Format = "serialized"> extends Attributes<T> {
	actionName: string,
	extra: GeneralObject
}

export type AuditTrailResource<T extends Completeness = "read"> = Resource<
	T,
	AuditTrailResourceIdentifier<T>,
	AuditTrailAttributes<"serialized">
>

export interface DeserializedAuditTrailResource extends DeserializedResource<
	AuditTrailResourceIdentifier<"read">,
	AuditTrailAttributes<"deserialized">
> {
	user: DeserializedUserResource|null
}

export type AuditTrailDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	AuditTrailResourceIdentifier<T>,
	AuditTrailAttributes<"serialized">,
	AuditTrailResource<T>
>

export type AuditTrailListDocument<T extends Completeness = "read"> = ResourceListDocument<
T,
AuditTrailResourceIdentifier<T>,
AuditTrailAttributes<"serialized">,
AuditTrailResource<T>
>

export type DeserializedAuditTrailDocument = DeserializedResourceDocument<
	AuditTrailResourceIdentifier<"read">,
	AuditTrailAttributes<"deserialized">,
	DeserializedAuditTrailResource
>

export type DeserializedAuditTrailListDocument = DeserializedResourceListDocument<
	AuditTrailResourceIdentifier<"read">,
	AuditTrailAttributes<"deserialized">,
	DeserializedAuditTrailResource
>
