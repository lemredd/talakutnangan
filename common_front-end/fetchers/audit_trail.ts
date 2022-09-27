import type {
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	AuditTrailResource,
	DeserializedAuditTrailResource,
	AuditTrailDocument,
	AuditTrailListDocument,
	DeserializedAuditTrailDocument,
	DeserializedAuditTrailListDocument
} from "$/types/documents/audit_trail"

import BaseFetcher from "$@/fetchers/base"

export default class AuditTrailFetcher extends BaseFetcher<
	AuditTrailResourceIdentifier<"read">,
	AuditTrailAttributes<"serialized">,
	AuditTrailAttributes<"deserialized">,
	AuditTrailResource,
	DeserializedAuditTrailResource,
	AuditTrailDocument,
	AuditTrailListDocument,
	DeserializedAuditTrailDocument,
	DeserializedAuditTrailListDocument
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "AuditTrail")
	}

	constructor() {
		super(AuditTrailFetcher.basePath, AuditTrailFetcher.type)
	}
}
