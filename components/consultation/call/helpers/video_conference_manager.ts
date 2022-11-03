import type {
	VideoConferenceManager,
	VideoConferenceEngine,
	LocalAudioTrack,
	LocalVideoTrack
} from "@/consultation/call/helpers/types/video_conference_manager"

import Stub from "$/singletons/stub"
import isUndefined from "$/type_guards/is_undefined"

let AgoraRTC: VideoConferenceManager|null = null
export let videoConferenceEngine: VideoConferenceEngine|null = null

export async function initiateVideoConferenceEngine() {
	if (!isUndefined(window)) {
		// @ts-ignore
		AgoraRTC = await import("agora-rtc-sdk-ng") as VideoConferenceManager
		videoConferenceEngine = AgoraRTC.createClient({
			"codec": "vp8",
			"mode": "rtc"
		})
	}
}

type LocalTracks = {
	"localAudioTrack": LocalAudioTrack|null
	"localVideoTrack": LocalVideoTrack|null
}
export const localTracks: LocalTracks = {
	"localAudioTrack": null,
	"localVideoTrack": null
}

export async function joinAndPresentLocalTracks(
	appId: string,
	chatMessageActivityID: string,
	localParticipantID: string,
	token: string
) {
	videoConferenceEngine = videoConferenceEngine as VideoConferenceEngine
	AgoraRTC = AgoraRTC as VideoConferenceManager

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
	videoConferenceEngine = videoConferenceEngine as VideoConferenceEngine
	AgoraRTC = AgoraRTC as VideoConferenceManager

	localTracks.localAudioTrack?.close()
	localTracks.localVideoTrack?.close()
}

export function mockJoining() {
	AgoraRTC = AgoraRTC as VideoConferenceManager
	localTracks.localAudioTrack = Stub.runConditionally(
		AgoraRTC.createMicrophoneAudioTrack,
		(): any => "this runs on test"
	) as unknown as any
	localTracks.localVideoTrack = Stub.runConditionally(
		AgoraRTC.createMicrophoneAudioTrack,
		(): any => "this runs on test"
	) as unknown as any
}
