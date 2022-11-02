
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
	generateToken(channelName: string, uid: string): Promise<Response<
		any,
		any,
		any,
		any,
		any,
		{ "rtcToken": string }
	>> {
		const pathToGenerateToken = specializePath(RTC_TOKEN_LINK, {
			channelName,
			uid
		})
		const headers = new Headers({ "Access-Control-Allow-Origin": "*" })

		return this.getFrom(pathToGenerateToken, headers)
	}
}
