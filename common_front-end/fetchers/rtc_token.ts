
import { RTC_TOKEN_LINK } from "$/constants/template_links"

import type { Response } from "$@/types/independent"

import BaseFetcher from "$@/fetchers/base"
import specializePath from "$/helpers/specialize_path"

// TODO(lead): make specific types

export default class extends BaseFetcher<
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	{
		"extraCreateData": any,
	}
> {
	constructor() {
		super({} as any)
	}

	generateToken(hostName: string, channelName: string, uid: string): Promise<Response<
		any,
		any,
		any,
		any,
		any,
		{ "rtcToken": string }
	>> {
		const pathToGenerateToken = specializePath(RTC_TOKEN_LINK, {
			channelName,
			hostName,
			uid
		})
		const headers = new Headers({ "Access-Control-Allow-Origin": "*" })

		return this.getFrom(pathToGenerateToken, {
			headers,
			"otherRequestOptions": {
				"mode": "cors"
			}
		})
	}
}
