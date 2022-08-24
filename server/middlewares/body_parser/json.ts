import express from "express"

import type { Request } from "!/types/dependent"
import { JSON_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import RequestFilter from "!/bases/request_filter"

export default class JSONBodyParser extends RequestFilter {
	private static parse = express.json({
		"type": [
			JSON_MEDIA_TYPE,
			JSON_API_MEDIA_TYPE
		]
	})

	async filterRequest(request: Request): Promise<void> {
		await this.runFilter(JSONBodyParser.parse, request)
	}
}
