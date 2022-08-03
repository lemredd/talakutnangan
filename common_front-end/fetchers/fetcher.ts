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

	create(attributes: U): Promise<Response<T, U, V, W, Z>> {
		return this.handleResponse(
			this.postJSON(`${this.type}/create`, {
				data: {
					type: this.type,
					attributes
				}
			})
		)
	}

	list(parameters: C): Promise<Response<T, U, V, W, A>> {
		const commaDelimitedSort = {
			...parameters,
			sort: parameters.sort.join(",")
		}
		return this.handleResponse(
			this.getJSON(
				`${this.type}/list?${stringifyQuery(commaDelimitedSort)}`
			)
		)
	}

	update(id: number, attributes: U): Promise<Response<T, U, V, W, null>> {
		return this.handleResponse(
			this.patchJSON(`${this.type}/update/:id`, { id }, {
				data: {
					type: this.type,
					id,
					attributes
				}
			})
		)
	}

	archive(IDs: number[]): Promise<Response<T, U, V, W, null>>  {
		return this.handleResponse(
			this.deleteJSON(`${this.type}/archive`, {}, {
				data: IDs.map(id => ({ type: this.type, id }))
			})
		)
	}

	restore(IDs: number[]): Promise<Response<T, U, V, W, null>>  {
		return this.handleResponse(
			this.patchJSON(`${this.type}/restore`, {}, {
				data: IDs.map(id => ({ type: this.type, id }))
			})
		)
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

	protected handleResponse<D extends Z|A|null>(
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