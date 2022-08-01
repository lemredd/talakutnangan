import type { Serializable } from "$/types/general"
import type { Response } from "$@/types/independent"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { CommonQueryParameters } from "$/types/query"
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

import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/helpers/request_environment"
import specializedPath from "$/helpers/specialize_path"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class Fetcher<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>,
	W extends DeserializedResource<T, U>,
	X extends ResourceDocument<T, U, V>,
	Y extends ResourceListDocument<T, U, V>,
	Z extends DeserializedResourceDocument<T, U, W>,
	A extends DeserializedResourceListDocument<T, U, W>,
	B extends Serializable,
	C extends CommonQueryParameters = CommonQueryParameters
> extends RequestEnvironment {
	protected static basePath: string = ""
	protected static type: string = ""

	static initialize(basePath: string, type: string = "") {
		this.basePath = basePath
		this.type = type
	}

	protected basePath: string = ""
	protected type: string = ""

	constructor(basePath: string = Fetcher.basePath, type: string = Fetcher.type) {
		super()
		this.basePath = basePath
		this.type = type
	}

	create(attributes: T): Promise<Response<T, U, V, W, X>> {
		return this.postJSON(`${this.type}/create`, {
			data: {
				type: this.type,
				attributes
			}
		}) as Promise<Response<T, U, V, W, X>>
	}

	list(parameters: C): Promise<Response<T, U, V, W, Y>> {
		const commaDelimitedSort = {
			...parameters,
			sort: parameters.sort.join(",")
		}
		return this.getJSON(
			`${this.type}/list?${stringifyQuery(commaDelimitedSort)}`
		) as Promise<Response<T, U, V, W, Y>>
	}

	update(id: number, attributes: T): Promise<Response<T, U, V, W, null>> {
		return this.patchJSON(`${this.type}/update/:id`, { id }, {
			data: {
				type: this.type,
				id,
				attributes
			}
		}) as Promise<Response<T, U, V, W, null>>
	}

	archive(IDs: number[]): Promise<Response<T, U, V, W, null>>  {
		return this.deleteJSON(`${this.type}/archive`, {}, {
			data: IDs.map(id => ({ type: this.type, id }))
		}) as Promise<Response<T, U, V, W, null>>
	}

	restore(IDs: number[]): Promise<Response<T, U, V, W, null>>  {
		return this.patchJSON(`${this.type}/restore`, {}, {
			data: IDs.map(id => ({ type: this.type, id }))
		}) as Promise<Response<T, U, V, W, null>>
	}

	getJSON(path: string): Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.requestJSON(path, {
			method: "GET",
			headers: this.makeJSONHeaders()
		})
	}

	postJSON(path: string, data: Serializable): Promise<Response<T, U, V, W, X|Y|B|null>> {
		return this.requestJSON(path, {
			method: "POST",
			headers: this.makeJSONHeaders(),
			body: JSON.stringify(data)
		})
	}

	patchJSON(
		pathTemplate: string,
		IDs: { [key:string]: number },
		data: Serializable
	): Promise<Response<T, U, V, W, X|Y|B|null>> {
		const path = specializedPath(pathTemplate, IDs)

		return this.requestJSON(path, {
			method: "PATCH",
			headers: this.makeJSONHeaders(),
			body: JSON.stringify(data)
		})
	}

	deleteJSON(
		pathTemplate: string,
		IDs: { [key:string]: number },
		data: Serializable
	): Promise<Response<T, U, V, W, X|Y|B|null>> {
		const path = specializedPath(pathTemplate, IDs)

		return this.requestJSON(path, {
			method: "DELETE",
			headers: this.makeJSONHeaders(),
			body: JSON.stringify(data)
		})
	}

	protected handleResponse<D extends (Z|A|null)>(
		response: Promise<Response<T, U, V, W, X|Y|B|null>>
	): Promise<Response<T, U, V, W, D>> {
		return response.then(({ body, status }) => {
			if(status >= 200 || status <= 299) {
				return {
					body: deserialize(body) as D,
					status
				}
			} else {
				throw { body, status }
			}
		})
	}

	private async requestJSON(path: string, request: RequestInit)
	: Promise<Response<any, any, any, any, any>> {
		const completePath = `${this.basePath}/${path}`
		return await fetch(new Request(completePath, request)).then(async response => {
			return {
				status: response.status,
				body: response.status === this.status.NO_CONTENT ? null : await response.json()
			}
		})
	}

	private makeJSONHeaders(): Headers {
		return new Headers({
			"Content-Type": JSON_API_MEDIA_TYPE,
			"Accept": JSON_API_MEDIA_TYPE
		})
	}
}
