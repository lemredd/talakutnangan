import type { Serializable } from "$/types/database"
import type { Response } from "$@/types/independent"
import { JSON_API_MEDIA_TYPE } from "!/types/independent"

import RequestEnvironment from "$!/singletons/request_environment"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class extends RequestEnvironment {
	static initialize() {
		// ! Kept in case of set-up in the future
	}

	static getJSON(basePath: string): Promise<Response> {
		return fetch(basePath, {
			method: "GET",
			headers: {
				"Content-Type": JSON_API_MEDIA_TYPE,
				"Accept": JSON_API_MEDIA_TYPE
			}
		})
		.then(async response => {
			return {
				status: response.status,
				body: await response.json()
			}
		})
	}

	static postJSON(basePath: string, data: Serializable): Promise<Response> {
		return fetch(basePath, {
			method: "POST",
			headers: {
				"Content-Type": JSON_API_MEDIA_TYPE,
				"Accept": JSON_API_MEDIA_TYPE
			},
			body: JSON.stringify(data)
		})
		.then(async response => {
			return {
				status: response.status,
				body: await response.json()
			}
		})
	}
}
