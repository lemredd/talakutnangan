import type { Response } from "!/types/dependent"
import { JSON_API_MEDIA_TYPE } from "$/types/server"

import OkResponseInfo from "!/response_infos/ok"

export default class extends OkResponseInfo {
	private name: string

	constructor(body: Buffer, name: string, type: string = JSON_API_MEDIA_TYPE) {
		super(body, type)
		this.name = name
	}

	sendThrough(response: Response): void {
		response.setHeader("Content-Disposition", `attachment; filename="${this.name}"`)
		super.sendThrough(response)
	}
}
