import { Response } from "!/types/dependent"

import type { Serializable } from "$/types/database"
import { JSON_API_MEDIA_TYPE } from "!/types/independent"

import Log from "$!/singletons/log"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * Base class to represent the returned response from controller handles.
 */
export default class ResponseInfo {
	private status: number
	private type: string
	private body: Serializable|null

	constructor(status: number, body: Serializable|null);
	constructor(status: number, type: string, body: Serializable|null);
	constructor(
		status: number,
		raw_body_or_type: string|Serializable|null,
		raw_body?: Serializable|null
	) {
		let type = JSON_API_MEDIA_TYPE
		let body = raw_body_or_type

		if (raw_body) {
			type = raw_body_or_type as string
			body = raw_body as Serializable|null
		}

		this.status = status
		this.type = type
		this.body = body as Serializable|null
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
		response.type(this.type)

		if (this.body !== null) {
			response.send(this.body)
		}
	}
}
