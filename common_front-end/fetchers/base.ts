import type { Response } from "$@/types/independent"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { CommonQueryParameters } from "$/types/query"
import type { Serializable, GeneralObject } from "$/types/general"
import type {
	ResourceIdentifier,
	Attributes,
	Resource,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

import deserialize from "$/helpers/deserialize"
import stringifyQuery from "$@/fetchers/stringify_query"
import specializedPath from "$/helpers/specialize_path"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class Fetcher<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>,
	W extends DeserializedResource<string, T, U>,
	X extends ResourceDocument<T, U, V>,
	Y extends ResourceListDocument<T, U, V>,
	Z extends DeserializedResourceDocument<string, T, U, W>,
	A extends DeserializedResourceListDocument<string, T, U, W>,
	B extends Serializable,
	C extends CommonQueryParameters = CommonQueryParameters
> extends RequestEnvironment {
	protected static basePath = ""
	protected static type = ""

	static initialize(basePath: string, type = "") {
		this.basePath = basePath
		this.type = type
	}

	protected basePath = ""
	protected type = ""

	constructor(basePath: string = Fetcher.basePath, type: string = Fetcher.type) {
		super()
		this.basePath = basePath
		this.type = type
	}

	create(attributes: U): Promise<Response<T, U, V, W, Z>> {
		return this.handleResponse(
			this.postJSON(`${this.type}`, {
				"data": {
					"type": this.type,
					attributes
				}
			})
		)
	}

	read(id: string): Promise<Response<T, U, V, W, Z>> {
		const path = specializedPath(`${this.type}/:id`, { id })

		return this.handleResponse(
			this.getJSON(path)
		)
	}

	list(parameters: C): Promise<Response<T, U, V, W, A>> {
		const commaDelimitedSort = {
			...parameters,
			"sort": parameters.sort.join(",")
		}
		return this.handleResponse(
			this.getJSON(
				`${this.type}?${stringifyQuery(commaDelimitedSort)}`
			)
		)
	}

	update(id: string, attributes: U): Promise<Response<T, U, V, W, null>> {
		return this.handleResponse(
			this.patchJSON(`${this.type}/:id`, { id }, {
				"data": {
					"type": this.type,
					id,
					attributes
				}
			})
		)
	}

	archive(IDs: string[], meta?: GeneralObject): Promise<Response<T, U, V, W, null>> {
		return this.handleResponse(
			this.deleteJSON(`${this.type}`, {}, {
				"data": IDs.map(id => ({
					"type": this.type,
					id
				})),
				meta
			})
		)
	}

	restore(IDs: string[], meta?: GeneralObject): Promise<Response<T, U, V, W, null>> {
		return this.handleResponse(
			this.patchJSON(`${this.type}`, {}, {
				"data": IDs.map(id => ({
					"type": this.type,
					id
				})),
				meta
			})
		)
	}

	getJSON(path: string): Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.getFrom(path, this.makeJSONHeaders())
	}

	postJSON(path: string, data: Serializable): Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.postTo(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	patchJSON(
		pathTemplate: string,
		IDs: { [key:string]: string },
		data: Serializable
	): Promise<Response<T, U, V, W, X|Y|B|null>> {
		const path = specializedPath(pathTemplate, IDs)

		return this.patchThrough(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	deleteJSON(
		pathTemplate: string,
		IDs: { [key:string]: string },
		data: Serializable
	): Promise<Response<T, U, V, W, X|Y|B|null>> {
		const path = specializedPath(pathTemplate, IDs)

		return this.deleteThrough(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	getFrom(path: string, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.requestJSON(path, {
			"method": "GET",
			headers
		})
	}

	postTo(path: string, body: string|FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.requestJSON(path, {
			"method": "POST",
			headers,
			body
		})
	}

	patchThrough(path: string, body: string|FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.requestJSON(path, {
			"method": "PATCH",
			headers,
			body
		})
	}

	deleteThrough(path: string, body: string|FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.requestJSON(path, {
			"method": "DELETE",
			headers,
			body
		})
	}

	protected handleResponse<D extends Z|A|null>(
		response: Promise<Response<T, U, V, W, X|Y|B|null>>
	): Promise<Response<T, U, V, W, D>> {
		return response.then(({ body, status }) => {
			if (status >= 200 || status <= 299) {
				return {
					"body": deserialize(body) as D,
					status
				}
			}
			throw {
				body,
				status
			}
		})
	}

	private async requestJSON(path: string, request: RequestInit)
	: Promise<Response<any, any, any, any, any>> {
		const completePath = `${this.basePath}/${path}`
		const parsedResponse = await fetch(new Request(completePath, request))
		.then(async response => ({
			"body": response.status === this.status.NO_CONTENT ? null : await response.json(),
			"status": response.status
		}))
		return parsedResponse
	}

	protected makeJSONHeaders(contentType: string = JSON_API_MEDIA_TYPE): Headers {
		return new Headers({
			"Accept": JSON_API_MEDIA_TYPE,
			"Content-Type": contentType
		})
	}
}
