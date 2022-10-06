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

import {
	USER_LINK,
	UPDATE_PASSWORD_LINK,
	LOG_IN_LINK,
	LOG_OUT_LINK,
	IMPORT_USER_LINK,
	UPDATE_DEPARTMENT_OF_USER_LINK,
	UPDATE_ROLE_OF_USER_LINK
} from "$/constants/template_links"

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
	constructor() {
		super(USER_LINK)
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
			this.postJSON(LOG_IN_LINK, details)
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
		return await this.postJSON(LOG_OUT_LINK, {}) as Response<
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
		const path = specializePath(IMPORT_USER_LINK, { "type": this.links.type })
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
			this.patchJSON(UPDATE_PASSWORD_LINK, {
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

	async updateAttachedRole(id: string, attachedRoleIDs: string[]): Promise<Response<
		UserResourceIdentifier,
		UserAttributes<"serialized">,
		UserAttributes<"deserialized">,
		UserResource,
		DeserializedUserResource,
		null
	>> {
		return await this.handleResponse(
			this.patchJSON(UPDATE_ROLE_OF_USER_LINK, {
				id
			}, {
				"data": attachedRoleIDs.map(roleID => ({
					"id": roleID,
					"type": "role"
				}))
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

	async updateDepartment(id: string, departmentID: string): Promise<Response<
		UserResourceIdentifier,
		UserAttributes<"serialized">,
		UserAttributes<"deserialized">,
		UserResource,
		DeserializedUserResource,
		null
	>> {
		return await this.handleResponse(
			this.patchJSON(UPDATE_DEPARTMENT_OF_USER_LINK, {
				id
			}, {
				"data": {
					"id": departmentID,
					"type": "department"
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
