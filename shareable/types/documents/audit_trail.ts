import type { GeneralObject } from "$/types/general"
import type {
	AttachableCompleteness as Completeness,
	CompletenessRegulator,
	ReadableCompleteness,
	PaginatedDocument
} from "$/types/documents/irregularity"
import type {
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

export type AuditTrailResourceIdentifier<T extends Completeness = "read">
= ResourceIdentifier<CompletenessRegulator<T>> & PaginatedDocument<T> & {
	type: "audit_trail"
}

export interface AuditTrailAttributes<T extends Format = "serialized"> extends Attributes<T> {
	actionName: string,
	extra: GeneralObject
}

export type AuditTrailResource<T extends Completeness = "read"> = Resource<
	CompletenessRegulator<T>,
	AuditTrailResourceIdentifier<T>,
	AuditTrailAttributes<"serialized">
>

export type DeserializedAuditTrailResource<T extends ReadableCompleteness = "read">
= DeserializedResource<
	AuditTrailResourceIdentifier<T>,
	AuditTrailAttributes<"deserialized">
>

export type AuditTrailDocument<T extends Completeness = "read"> = ResourceDocument<
	CompletenessRegulator<T>,
	AuditTrailResourceIdentifier<T>,
	AuditTrailAttributes<"serialized">,
	AuditTrailResource<T>
>

export type AuditTrailListDocument<T extends Completeness = "read"> = ResourceListDocument<
CompletenessRegulator<T>,
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
