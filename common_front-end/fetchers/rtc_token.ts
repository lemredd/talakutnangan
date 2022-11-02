
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
	generateToken(
		channelName: string,
		uid: string,
		expireTime: string) {
		const pathToGenerateToken = specializePath(RTC_TOKEN_LINK, {
			channelName,
			expireTime,
			uid
		})
		const headers = new Headers({ "Access-Control-Allow-Origin": "*" })

		this.getFrom(pathToGenerateToken, headers)
	}
}
