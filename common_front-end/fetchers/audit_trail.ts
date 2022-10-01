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

import { AUDIT_TRAIL_LINK } from "$/constants/template_links"

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
		super(AUDIT_TRAIL_LINK)
	}
}
