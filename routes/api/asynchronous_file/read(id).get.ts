import type { Request, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import OkResponseInfo from "!/response_infos/ok"
import BoundController from "!/controllers/bound"
import Manager from "%/managers/asynchronous_file"

import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

export default class extends BoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new BelongsToCurrentUserPolicy(this.manager)
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: Request, unusedResponse: Response): Promise<OkResponseInfo> {
		const manager = new Manager(request)
		const { id } = request.params

		const document = await manager.findWithID(Number(id), {
			"constraints": {
				"filter": {
					"existence": "*"
				}
			}
		})

		return new OkResponseInfo(document)
	}
}
