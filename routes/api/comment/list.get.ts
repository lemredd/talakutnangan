import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { CommentQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import Manager from "%/managers/comment"
import PostManager from "%/managers/post"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import PermissionBasedPolicy from "!/policies/permission-based"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_ALL_DEPARTMENTS,
	READ_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import makeListRules from "!/rule_sets/make_list"
import makeIDBasedFilterRules from "!/rule_sets/make_id-based_filter"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_ALL_DEPARTMENTS,
			READ_ANYONE_ON_OWN_DEPARTMENT
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(Manager, {
			...makeIDBasedFilterRules("postID", PostManager, {
				"maySkip": false,
				"mustCast": true
			})
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as CommentQueryParameters<number>

		const manager = new Manager(request)

		const comments = await manager.list(constraints)

		return new ListResponse(comments)
	}
}
