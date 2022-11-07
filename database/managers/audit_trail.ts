import type { Pipe } from "$/types/database"
import type { AuditTrailQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { AuditTrailAttributes } from "$/types/documents/audit_trail"

import BaseManager from "%/managers/base"
import Model from "%/models/audit_trail"
import includeUser from "%/queries/audit_trail/include_user"
import AuditTrailTransformer from "%/transformers/audit_trail"

import siftBySlug from "%/queries/audit_trail/sift_by_slug"

interface RawAuditTrailAttributes extends AuditTrailAttributes<"deserialized"> {
	userID: number|null
}

export default class extends BaseManager<
	Model,
	RawAuditTrailAttributes,
	AuditTrailQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): AuditTrailTransformer { return new AuditTrailTransformer() }

	get singleReadPipeline(): Pipe<FindAndCountOptions<Model>, AuditTrailQueryParameters>[] {
		return [
			includeUser,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<FindAndCountOptions<Model>, AuditTrailQueryParameters>[] {
		return [
			siftBySlug,
			includeUser,
			...super.listPipeline
		]
	}

	protected get exposableColumns(): string[] {
		const excludedColumns = new Set([ "extra", "userID" ])
		return super.exposableColumns.filter(columnName => !excludedColumns.has(columnName))
	}
}
