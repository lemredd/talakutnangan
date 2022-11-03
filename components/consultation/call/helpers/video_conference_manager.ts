import type {
	IAgoraRTC,
	IAgoraRTCClient,
	ILocalAudioTrack,
	ILocalVideoTrack
} from "agora-rtc-sdk-ng"

import isUndefined from "$/type_guards/is_undefined"

let AgoraRTC: IAgoraRTC|null = null
export let videoConferenceEngine: IAgoraRTCClient|null = null

export async function initiateVideoConferenceEngine() {
	if (!isUndefined(window)) {
		// @ts-ignore
		AgoraRTC = await import("agora-rtc-sdk-ng") as IAgoraRTC
		videoConferenceEngine = AgoraRTC.createClient({
			"codec": "vp8",
			"mode": "rtc"
		})
	}
}

type LocalTracks = {
	"localAudioTrack": ILocalAudioTrack|null
	"localVideoTrack": ILocalVideoTrack|null
}
const localTracks: LocalTracks = {
	"localAudioTrack": null,
	"localVideoTrack": null
}

export async function joinAndPresentLocalTracks(
	appId: string,
	chatMessageActivityID: string,
	localParticipantID: string,
	token: string
) {
	videoConferenceEngine = videoConferenceEngine as IAgoraRTCClient
	AgoraRTC = AgoraRTC as IAgoraRTC

	await videoConferenceEngine.join(
		appId,
		"call",
		token,
		Number(chatMessageActivityID)
	)
	localTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
	localTracks.localVideoTrack = await AgoraRTC.createCameraVideoTrack()

	await videoConferenceEngine.publish([
		localTracks.localAudioTrack,
		localTracks.localVideoTrack
	])
	localTracks.localVideoTrack.play(localParticipantID)
}

export function leaveAndRemoveLocalTracks() {
	videoConferenceEngine = videoConferenceEngine as IAgoraRTCClient
	AgoraRTC = AgoraRTC as IAgoraRTC
}
