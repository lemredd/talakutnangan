import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { UserIdentifierListWithTimeConsumedDocument } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Manager from "%/managers/consultation"
import UserManager from "%/managers/user"
import present from "!/validators/manager/present"
import Merger from "!/middlewares/miscellaneous/merger"
import IDParameterValidator from "!/validations/id_parameter"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			CommonMiddlewareList.reachableEmployeeOnlyPolicy
		]) as unknown as Policy
	}

	get validations(): Validation[] {
		return [
			// TODO: Allow adding other rules to check if consultation belongs to current user
			new IDParameterValidator([
				[ "id", UserManager, present ]
			])
		]
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Consultation | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const { id } = request.params
		const manager = new Manager(request)

		const consultations = await manager.sumTimePerStudents({
			"filter": {
				"dateTimeRange": {
					"begin": new Date("2022-09-01T00:00:00"),
					"end": new Date("2022-09-30T11:59:59")
				},
				"existence": "exists",
				"user": id
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-name" ]
		}) as UserIdentifierListWithTimeConsumedDocument

		return {
			consultations
		}
	}
}
