import type { ModelCtor } from "%/types/dependent"
import type { CommonQueryParameters } from "$/types/query"
import type { AuditTrailAttributes } from "$/types/documents/audit_trail"

import BaseManager from "%/managers/base"
import AuditTrail from "%/models/audit_trail"
import AuditTrailTransformer from "%/transformers/audit_trail"

export default class  extends BaseManager<AuditTrail, AuditTrailAttributes, CommonQueryParameters> {
	get model(): ModelCtor<AuditTrail> { return AuditTrail }

	get transformer(): AuditTrailTransformer { return new AuditTrailTransformer() }
}
