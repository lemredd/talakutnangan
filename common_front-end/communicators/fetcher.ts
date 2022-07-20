import type { Serializable } from "$/types/database"
import type { Response } from "$@/types/independent"
import { JSON_API_MEDIA_TYPE } from "$/types/server"

import RequestEnvironment from "$/helpers/request_environment"
import specializedPath from "$@/helpers/specialize_path"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class extends RequestEnvironment {
	private static basePath: string = "/"

	static initialize(basePath: string) {
		this.basePath = basePath
	}

	static create(type: string, attributes: Serializable): Promise<Response> {
		return this.postJSON(`${type}/create`, {
			data: {
				type,
				attributes
			}
		})
	}

	static update(type: string, id: number, attributes: Serializable): Promise<Response> {
		return this.patchJSON(`${type}/update/:id`, { id }, {
			data: {
				type,
				id,
				attributes
			}
		})
	}

	static getJSON(path: string): Promise<Response> {
		return this.requestJSON(new Request(path, {
			method: "GET",
			headers: this.makeJSONHeaders()
		}))
	}

	static postJSON(path: string, data: Serializable): Promise<Response> {
		return this.requestJSON(new Request(path, {
			method: "POST",
			headers: {
				"Content-Type": JSON_API_MEDIA_TYPE,
				"Accept": JSON_API_MEDIA_TYPE
			},
			body: JSON.stringify(data)
		}))
	}

	static patchJSON(
		pathTemplate: string,
		IDs: { [key:string]: number },
		data: Serializable
	): Promise<Response> {
		const path = specializedPath(pathTemplate, IDs)

		return this.requestJSON(new Request(path, {
			method: "PATCH",
			headers: {
				"Content-Type": JSON_API_MEDIA_TYPE,
				"Accept": JSON_API_MEDIA_TYPE
			},
			body: JSON.stringify(data)
		}))
	}

	private static async requestJSON(request: Request): Promise<Response> {
		return await fetch(request).then(async response => {
			return {
				status: response.status,
				body: await response.json()
			}
		})
	}

	private static makeJSONHeaders(): Headers {
		return new Headers({
			"Content-Type": JSON_API_MEDIA_TYPE,
			"Accept": JSON_API_MEDIA_TYPE
		})
	}
}
