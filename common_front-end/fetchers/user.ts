import type { UserAttributes } from "$/types/documents/user"
import type { Response, LogInDetails } from "$@/types/independent"
import Fetcher from "$@/fetchers/fetcher"

export default class UserFetcher extends Fetcher<UserAttributes> {
	static initialize(basePath: string) {
		super.initialize(basePath, "user")
	}

	constructor() {
		super(UserFetcher.basePath, UserFetcher.type)
	}

	async logIn(details: LogInDetails): Promise<Response> {
		return await this.postJSON(`${this.type}/log_in`, details)
	}
}
