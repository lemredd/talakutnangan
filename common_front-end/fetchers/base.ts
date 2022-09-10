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

import deserialize from "$/object/deserialize"
import specializedPath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class Fetcher<
	T extends ResourceIdentifier<"read">,
	U extends Attributes<"serialized">,
	V extends Attributes<"deserialized">,
	W extends Resource<"read", T, U>,
	X extends DeserializedResource<T, V>,
	Y extends ResourceDocument<"read", T, U, W>,
	Z extends ResourceListDocument<"read", T, U, W>,
	A extends DeserializedResourceDocument<T, V, X>,
	B extends DeserializedResourceListDocument<T, V, X>,
	C extends Serializable,
	D extends CommonQueryParameters = CommonQueryParameters,
	E extends Serializable = Serializable
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

	create(attributes: U, otherDataFields: E = {} as E): Promise<Response<T, U, V, W, X, A>> {
		return this.handleResponse(
			this.postJSON(`${this.type}`, {
				"data": {
					attributes,
					"type": this.type,
					...otherDataFields
				}
			})
		)
	}

	read(id: string): Promise<Response<T, U, V, W, X, A>> {
		const path = specializedPath(`${this.type}/:id`, { id })

		return this.handleResponse(
			this.getJSON(path)
		)
	}

	list(parameters: D): Promise<Response<T, U, V, W, X, B>> {
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

	update(id: string, attributes: U): Promise<Response<T, U, V, W, X, null>> {
		return this.handleResponse(
			this.patchJSON(`${this.type}/:id`, { id }, {
				"data": {
					attributes,
					id,
					"type": this.type
				}
			})
		)
	}

	archive(IDs: string[], meta?: GeneralObject): Promise<Response<T, U, V, W, X, null>> {
		return this.handleResponse(
			this.deleteJSON(`${this.type}`, {}, {
				"data": IDs.map(id => ({
					id,
					"type": this.type
				})),
				meta
			})
		)
	}

	restore(IDs: string[], meta?: GeneralObject): Promise<Response<T, U, V, W, X, null>> {
		return this.handleResponse(
			this.patchJSON(`${this.type}`, {}, {
				"data": IDs.map(id => ({
					id,
					"type": this.type
				})),
				meta
			})
		)
	}

	getJSON(path: string): Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		return this.getFrom(path, this.makeJSONHeaders())
	}

	postJSON(
		path: string,
		data: Serializable
	): Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		return this.postTo(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	patchJSON(
		pathTemplate: string,
		IDs: { [key:string]: string },
		data: Serializable
	): Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		const path = specializedPath(pathTemplate, IDs)

		return this.patchThrough(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	deleteJSON(
		pathTemplate: string,
		IDs: { [key:string]: string },
		data: Serializable
	): Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		const path = specializedPath(pathTemplate, IDs)

		return this.deleteThrough(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	getFrom(path: string, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		return this.requestJSON(path, {
			headers,
			"method": "GET"
		})
	}

	postTo(path: string, body: string | FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		return this.requestJSON(path, {
			body,
			headers,
			"method": "POST"
		})
	}

	patchThrough(path: string, body: string | FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		return this.requestJSON(path, {
			body,
			headers,
			"method": "PATCH"
		})
	}

	deleteThrough(path: string, body: string | FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X, Y | Z | C | null>> {
		return this.requestJSON(path, {
			body,
			headers,
			"method": "DELETE"
		})
	}

	protected handleResponse<F extends Y | Z | A | B | C | null>(
		response: Promise<Response<T, U, V, W, X, Y | Z | C | null>>,
		mustBeDeserialize = true
	): Promise<Response<T, U, V, W, X, F>> {
		return response.then(({ body, status }) => {
			if (status >= 200 || status <= 299) {
				return {
					"body": mustBeDeserialize ? deserialize(body) as F : body as F,
					status
				}
			}

			const error = {
				body,
				status
			}

			throw error
		})
	}

	private async requestJSON(path: string, request: RequestInit)
	: Promise<Response<any, any, any, any, any, any>> {
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
