import { generatePdf } from "html-pdf-node-ts"

import type { Request, Response, BaseManagerClass } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import URLMaker from "$!/singletons/url_maker"
import OkResponseInfo from "!/response_infos/ok"
import BoundController from "!/controllers/bound"
import Merger from "!/middlewares/miscellaneous/merger"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

export default class extends BoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			new BelongsToCurrentUserPolicy(this.manager)
		]) as unknown as Policy
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: Request, unusedResponse: Response): Promise<OkResponseInfo> {
		const { id } = request.params

		const URL = URLMaker.makeURLFromPath("consultation/:id", { id })

		Log.trace("controller", `converting "${URL}" to PDF`)

		const document = await generatePdf({
			"url": URL
		})

		return new OkResponseInfo(document, "application/pdf")
	}
}
