import { FieldRules } from "!/types/validation"
import type { OptionalMiddleware } from "!/types/independent"
import { AuthenticatedIDRequest, Response } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import deserialize from "$/object/deserialize"
import JSONController from "!/controllers/json"
import AuthorizationError from "$!/errors/authorization"
import NoContentResponseInfo from "!/response_infos/no_content"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"
import TransactionInitializer from "!/middlewares/miscellaneous/transaction_initializer"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
} from "$/permissions/user_combinations"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
			ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
		], {
			"checkOthers": (request: AuthenticatedIDRequest): Promise<void> => {
				const userData = deserialize(request.user) as DeserializedUserProfile
				const userID = Number(userData.data.id)
				const targetUserID = Number(request.params.id)

				if (userID === targetUserID) {
					return Promise.reject(
						new AuthorizationError("Users cannot archive themselves.")
					)
				}

				return Promise.resolve()
			}
		})
	}

	get postValidationMiddlewares(): OptionalMiddleware[] {
		const initializer = new TransactionInitializer()
		return [
			initializer
		]
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		return makeResourceIdentifierListDocumentRules("user", exists, UserManager)
	}

	async handle(
		request: AuthenticatedIDRequest,
		unusedResponse: Response
	): Promise<NoContentResponseInfo> {
		const manager = new UserManager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			new ActionAuditor("user.archive"),
			new TransactionCommitter()
		]
	}
}
