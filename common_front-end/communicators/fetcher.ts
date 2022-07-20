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
	private static basePath: string = ""

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

	static archive(type: string, IDs: number[]): Promise<Response> {
		return this.deleteJSON(`${type}/archive`, {}, {
			data: IDs.map(id => ({ type, id }))
		})
	}

	static restore(type: string, IDs: number[]): Promise<Response> {
		return this.patchJSON(`${type}/restore`, {}, {
			data: IDs.map(id => ({ type, id }))
		})
	}

	static getJSON(path: string): Promise<Response> {
		return this.requestJSON(path, {
			method: "GET",
			headers: this.makeJSONHeaders()
		})
	}

	static postJSON(path: string, data: Serializable): Promise<Response> {
		return this.requestJSON(path, {
			method: "POST",
			headers: this.makeJSONHeaders(),
			body: JSON.stringify(data)
		})
	}

	static patchJSON(
		pathTemplate: string,
		IDs: { [key:string]: number },
		data: Serializable
	): Promise<Response> {
		const path = specializedPath(pathTemplate, IDs)

		return this.requestJSON(path, {
			method: "PATCH",
			headers: this.makeJSONHeaders(),
			body: JSON.stringify(data)
		})
	}

	static deleteJSON(
		pathTemplate: string,
		IDs: { [key:string]: number },
		data: Serializable
	): Promise<Response> {
		const path = specializedPath(pathTemplate, IDs)

		return this.requestJSON(path, {
			method: "DELETE",
			headers: this.makeJSONHeaders(),
			body: JSON.stringify(data)
		})
	}

	private static async requestJSON(path: string, request: RequestInit): Promise<Response> {
		const completePath = `${this.basePath}/${path}`
		return await fetch(new Request(completePath, request)).then(async response => {
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
