import type { Serializable } from "$/types/general"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { UserQueryParameters } from "$/types/query"
import type { Response, LogInDetails } from "$@/types/independent"
import type {
	UserResource,
	UserDocument,
	UserAttributes,
	UserListDocument,
	UserResourceIdentifier,
	DeserializedUserResource,
	DeserializedUserDocument,
	DeserializedUserListDocument
} from "$/types/documents/user"

import { UPDATE_PASSWORD_PATH } from "$/constants/template_paths"

import specializePath from "$/helpers/specialize_path"

import BaseFetcher from "$@/fetchers/base"

export default class UserFetcher extends BaseFetcher<
	UserResourceIdentifier,
	UserAttributes<"serialized">,
	UserAttributes<"deserialized">,
	UserResource,
	DeserializedUserResource,
	UserDocument,
	UserListDocument,
	DeserializedUserDocument,
	DeserializedUserListDocument,
	{
		"queryParameters": UserQueryParameters
	}
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "user")
	}

	constructor() {
		super(UserFetcher.basePath, UserFetcher.type)
	}

	async logIn(details: LogInDetails): Promise<Response<
		UserResourceIdentifier,
		UserAttributes<"serialized">,
		UserAttributes<"deserialized">,
		UserResource,
		DeserializedUserResource,
		Serializable
	>> {
		return await this.handleResponse(
			this.postJSON(`${this.type}/log_in`, details)
		) as Response<
			UserResourceIdentifier,
			UserAttributes<"serialized">,
			UserAttributes<"deserialized">,
			UserResource,
			DeserializedUserResource,
			Serializable
		>
	}

	async logOut(): Promise<Response<
		UserResourceIdentifier,
		UserAttributes<"serialized">,
		UserAttributes<"deserialized">,
		UserResource,
		DeserializedUserResource,
		Serializable
	>> {
		return await this.postJSON(`${this.type}/log_out`, {}) as Response<
			UserResourceIdentifier,
			UserAttributes<"serialized">,
			UserAttributes<"deserialized">,
			UserResource,
			DeserializedUserResource,
			Serializable
		>
	}

	async import(form: FormData): Promise<Response<
		UserResourceIdentifier,
		UserAttributes<"serialized">,
		UserAttributes<"deserialized">,
		UserResource,
		DeserializedUserResource,
		DeserializedUserListDocument
	>> {
		const pathTemplate = ":type/import"
		const path = specializePath(pathTemplate, { "type": this.type })
		const headers = new Headers({
			"Accept": JSON_API_MEDIA_TYPE
		})

		return await this.handleResponse(this.postTo(path, form, headers)) as Response<
			UserResourceIdentifier,
			UserAttributes<"serialized">,
			UserAttributes<"deserialized">,
			UserResource,
			DeserializedUserResource,
			DeserializedUserListDocument
		>
	}

	async updatePassword(
		id: string,
		currentPassword: string,
		newPassword: string,
		confirmNewPassword: string
	): Promise<Response<
		UserResourceIdentifier,
		UserAttributes<"serialized">,
		UserAttributes<"deserialized">,
		UserResource,
		DeserializedUserResource,
		null
	>> {
		return await this.handleResponse(
			this.patchJSON(UPDATE_PASSWORD_PATH.slice("/api/".length), {
				id
			}, {
				"data": {
					"attributes": {
						"password": newPassword
					},
					id,
					"type": "user"
				},
				"meta": {
					"confirmPassword": confirmNewPassword,
					currentPassword
				}
			})
		) as Response<
			UserResourceIdentifier,
			UserAttributes<"serialized">,
			UserAttributes<"deserialized">,
			UserResource,
			DeserializedUserResource,
			null
		>
	}
}
