import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { PostQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import PostManager from "%/managers/post"
import QueryController from "!/controllers/query"

import {
	READ_ANYONE_ON_ALL_DEPARTMENTS,
	READ_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import PermissionBasedPolicy from "!/policies/permission-based"
import { post as permissionGroup } from "$/permissions/permission_list"

import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_ALL_DEPARTMENTS,
			READ_ANYONE_ON_OWN_DEPARTMENT
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(PostManager, {})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as PostQueryParameters<number>

		const manager = new PostManager(request)

		const post = await manager.list(constraints)

		return new ListResponse(post)
	}
}
