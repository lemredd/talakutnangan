import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { OptionalMiddleware } from "!/types/independent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"
import TransactionInitializer from "!/middlewares/miscellaneous/transaction_initializer"

import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import archived from "!/validators/manager/archived"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	get postValidationMiddlewares(): OptionalMiddleware[] {
		const initializer = new TransactionInitializer()
		return [
			initializer
		]
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules("role", archived, RoleManager)
	}


	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.restoreBatch(IDs)

		return new NoContentResponseInfo()
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			new ActionAuditor("role.restore", () => ({ "isSensitive": true })),
			new TransactionCommitter()
		]
	}
}
