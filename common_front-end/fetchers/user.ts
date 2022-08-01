import type { UserAttributes } from "$/types/documents/user"
import type { Response, LogInDetails } from "$@/types/independent"
import Fetcher from "$@/fetchers/fetcher"

export default class extends Fetcher<UserAttributes> {
	static initialize(basePath: string) {
		super.initialize(basePath, "user")
	}

	async logIn(details: LogInDetails): Promise<Response> {
		return await this.postJSON(`${this.type}/log_in`, details)
	}
}
