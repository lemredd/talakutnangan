import { Response } from "!/types/dependent"

import type { Serializable } from "$/types/database"
import { JSON_API_MEDIA_TYPE } from "!/types/independent"

import Log from "$!/singletons/log"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * Base class to represent the returned response from controller handles.
 */
export class ResponseInfo {
	private status: number
	private body: Serializable|null

	constructor(status: number, body: Serializable|null) {
		this.status = status
		this.body = body
	}

	sendThrough(response: Response): void {
		if (
			RequestEnvironment.isOnTest
			&& this.status !== RequestEnvironment.status.NO_CONTENT
			&& this.body === null
		) {
			const URL = response.req.url
			const message = `There should be a response body in "${URL}" as it returns ${this.status}`
			Log.errorMessage("response", message)
		}

		response.status(this.status)

		if (this.body === null) {
			response.type(JSON_API_MEDIA_TYPE)
			response.send(this.body)
		}
	}
}
