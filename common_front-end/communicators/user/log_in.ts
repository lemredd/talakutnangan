import type { LogInDetails } from "$@/types/independent"
import type { Response } from "$@/types/independent"
import Fetcher from "$@/communicators/fetcher"

export default async function(details: LogInDetails): Promise<Response> {
	return await Fetcher.postJSON("user/log_in", details)
}
