import type { Serializable } from "$/types/general"
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
	Serializable,
	UserQueryParameters
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
		return await this.postJSON(`${this.type}/log_in`, details) as Response<
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
}
