import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { Serializable, FetcherLinks } from "$/types/general"
import type {
	Response,
	ArchiveMeta,
	RestoreMeta,
	OtherDocuments,
	QueryParameters,
	ExtraUpdateData,
	ExtraCreateData,
	ExtraCreateDocumentProps,
	ExtraUpdateDocumentProps,
	GenericFetcherParameters
} from "$@/types/independent"
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
import specializePath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class Fetcher<
	// Type of resource identifier necessary to fill other generics
	T extends ResourceIdentifier<"read">,
	// Type of serialized attribute necessary to fill other generics
	U extends Attributes<"serialized">,
	// Type of deserialized attribute necessary to fill other generics
	V extends Attributes<"deserialized">,
	// Type of resource necessary to fill other generics
	W extends Resource<"read", T, U>,
	// Type of deserialized resource necessary to fill other generics
	X extends DeserializedResource<T, V>,
	// Type of resource document to be returned by the some possible readers
	Y extends ResourceDocument<"read", T, U, W>,
	// Type of resource list document to be returned by the some possible readers
	Z extends ResourceListDocument<"read", T, U, W>,
	// Type of deserialized resource document to be returned by the `read()` and other s
	A extends DeserializedResourceDocument<T, V, X>,
	// Type of desrialized resource list document to be returned by the `list()` and others
	B extends DeserializedResourceListDocument<T, V, X>,
	// Type of response other than resource document to be returned by the some possible readers
	C extends Partial<GenericFetcherParameters> = Record<string, unknown>
> extends RequestEnvironment {
	protected links: FetcherLinks

	constructor(links: FetcherLinks) {
		super()
		this.links = links
	}

	create(attributes: U, {
		extraDataFields = {} as ExtraCreateData<C>,
		extraCreateDocumentProps = {} as ExtraCreateDocumentProps<C>
	}: Partial<{
		extraDataFields: ExtraCreateData<C>,
		extraCreateDocumentProps: ExtraCreateDocumentProps<C>
	}> = {}): Promise<Response<T, U, V, W, X, A>> {
		return this.handleResponse(
			this.postJSON(this.links.unbound, {
				"data": {
					attributes,
					"type": this.links.type,
					...extraDataFields
				},
				...extraCreateDocumentProps
			})
		)
	}

	read(id: string): Promise<Response<T, U, V, W, X, A>> {
		const path = specializePath(this.links.bound, { id })

		return this.handleResponse(
			this.getJSON(path)
		)
	}

	list(parameters: QueryParameters<C>): Promise<Response<T, U, V, W, X, B>> {
		const commaDelimitedSort = {
			...parameters,
			"sort": parameters.sort.join(",")
		}
		return this.handleResponse(
			this.getJSON(specializePath(this.links.query, {
				"query": stringifyQuery(commaDelimitedSort)
			}))
		)
	}

	update(
		id: string,
		attributes: U,
		{
			extraDataFields = {} as ExtraUpdateData<C>,
			extraUpdateDocumentProps = {} as ExtraUpdateDocumentProps<C>
		}: Partial<{
			extraDataFields: ExtraUpdateData<C>,
			extraUpdateDocumentProps: ExtraUpdateDocumentProps<C>
		}> = {}
	): Promise<Response<T, U, V, W, X, null>> {
		return this.handleResponse(
			this.patchJSON(this.links.bound, { id }, {
				"data": {
					attributes,
					id,
					"type": this.links.type,
					...extraDataFields
				},
				...extraUpdateDocumentProps
			})
		)
	}

	archive(IDs: string[], {
		meta
	}: Partial<{
		meta: ArchiveMeta<C>
	}> = {}): Promise<Response<T, U, V, W, X, null>> {
		return this.handleResponse(
			this.deleteJSON(this.links.unbound, {}, {
				"data": IDs.map(id => ({
					id,
					"type": this.links.type
				})),
				meta
			})
		)
	}

	restore(IDs: string[], {
		meta
	}: Partial<{
		meta: RestoreMeta<C>
	}> = {}): Promise<Response<T, U, V, W, X, null>> {
		return this.handleResponse(
			this.patchJSON(this.links.unbound, {}, {
				"data": IDs.map(id => ({
					id,
					"type": this.links.type
				})),
				meta
			})
		)
	}

	getJSON(path: string): Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		return this.getFrom(path, {
			"headers": this.makeJSONHeaders()
		})
	}

	postJSON(
		path: string,
		data: Serializable
	): Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		return this.postTo(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	patchJSON(
		pathTemplate: string,
		IDs: { [key:string]: string },
		data: Serializable
	): Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		const path = specializePath(pathTemplate, IDs)

		return this.patchThrough(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	deleteJSON(
		pathTemplate: string,
		IDs: { [key:string]: string },
		data: Serializable
	): Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		const path = specializePath(pathTemplate, IDs)

		return this.deleteThrough(path, JSON.stringify(data), this.makeJSONHeaders())
	}

	getFrom(path: string, {
		headers = this.makeJSONHeaders(),
		otherRequestOptions = {}
	}: Partial<{
		headers: Headers,
		// eslint-disable-next-line no-undef
		otherRequestOptions: RequestInit
	}> = {})
	: Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		return this.requestJSON(path, {
			headers,
			"method": "GET",
			...otherRequestOptions
		})
	}

	postTo(path: string, body: string | FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		return this.requestJSON(path, {
			body,
			headers,
			"method": "POST"
		})
	}

	patchThrough(path: string, body: string | FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		return this.requestJSON(path, {
			body,
			headers,
			"method": "PATCH"
		})
	}

	deleteThrough(path: string, body: string | FormData, headers: Headers = this.makeJSONHeaders())
	: Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>> {
		return this.requestJSON(path, {
			body,
			headers,
			"method": "DELETE"
		})
	}

	protected handleResponse<F extends Y | Z | A | B | OtherDocuments<C> | null>(
		response: Promise<Response<T, U, V, W, X, Y | Z | OtherDocuments<C> | null>>,
		mustBeDeserialize = true
	): Promise<Response<T, U, V, W, X, F>> {
		return response.then(({ body, status }) => {
			if (status >= 200 && status <= 299) {
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

	// eslint-disable-next-line no-undef
	private async requestJSON(path: string, request: RequestInit)
	: Promise<Response<any, any, any, any, any, any>> {
		const parsedResponse = await fetch(new Request(path, request))

		.then(async response => {
			const isEmpty = response.status === this.status.NO_CONTENT
			|| response.headers.get("content-type") === null

			return {
				"body": isEmpty ? null : await response.json(),
				"status": response.status
			}
		})
		return parsedResponse
	}

	protected makeJSONHeaders(contentType: string = JSON_API_MEDIA_TYPE): Headers {
		return new Headers({
			"Accept": JSON_API_MEDIA_TYPE,
			"Content-Type": contentType
		})
	}
}
