import type { LogInDetails } from "$@/types/independent"
import type { Response } from "$@/types/independent"
import Fetcher from "$@/communicators/fetcher"

export default class extends Fetcher {
	static initialize(basePath: string) {
		super.initialize(basePath, "user")
	}

	static async logIn(details: LogInDetails): Promise<Response> {
		return await Fetcher.postJSON(`${this.type}/log_in`, details)
	}
}
