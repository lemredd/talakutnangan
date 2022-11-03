import { RtcRole, RtcTokenBuilder } from "agora-access-token"

import { MILLISECOND_IN_A_SECOND } from "$/constants/numerical"

import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

export default function(channelName: string, uid: number) {
	const appID = process.env.AGORA_APP_ID as string
	const appCertificate = process.env.AGORA_APP_CERT as string
	const currentTimeInMilliseconds = Date.now()
	const defaultExpireDuration = convertTimeToMilliseconds("01:00:00")
	const defaultExpiredTime
		= (currentTimeInMilliseconds + defaultExpireDuration) / MILLISECOND_IN_A_SECOND

	const token = RtcTokenBuilder.buildTokenWithUid(
		appID,
		appCertificate,
		channelName,
		uid,
		RtcRole.PUBLISHER,
		defaultExpiredTime
	)

	return token
}
