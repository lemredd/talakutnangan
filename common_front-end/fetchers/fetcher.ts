import type { Serializable } from "$/types/general"
import type { Response } from "$@/types/independent"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { CommonQueryParameters } from "$/types/query"

import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/helpers/request_environment"
import specializedPath from "$/helpers/specialize_path"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class Fetcher extends RequestEnvironment {
	private static basePath: string = ""
	private static type: string = ""

	static initialize(basePath: string, type: string = "") {
		this.basePath = basePath
		this.type = type
	}

	protected basePath: string = ""
	protected type: string = ""

	constructor() {
		super()
		this.basePath = Fetcher.basePath
		this.type = Fetcher.type
	}

	static create(attributes: Serializable): Promise<Response> {
		return this.postJSON(`${this.type}/create`, {
			data: {
				type: this.type,
				attributes
			}
		})
	}

	static list<T extends CommonQueryParameters = CommonQueryParameters>(parameters: T)
	: Promise<Response> {
		const commaDelimitedSort = {
			...parameters,
			sort: parameters.sort.join(",")
		}
		return this.getJSON(`${this.type}/list?${stringifyQuery(commaDelimitedSort)}`)
	}

	static update(id: number, attributes: Serializable): Promise<Response> {
		return this.patchJSON(`${this.type}/update/:id`, { id }, {
			data: {
				type: this.type,
				id,
				attributes
			}
		})
	}

	static archive(IDs: number[]): Promise<Response> {
		return this.deleteJSON(`${this.type}/archive`, {}, {
			data: IDs.map(id => ({ type: this.type, id }))
		})
	}

	static restore(IDs: number[]): Promise<Response> {
		return this.patchJSON(`${this.type}/restore`, {}, {
			data: IDs.map(id => ({ type: this.type, id }))
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
				body: response.status === this.status.NO_CONTENT ? null : await response.json()
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
