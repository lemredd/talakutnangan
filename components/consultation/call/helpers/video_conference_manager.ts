import type {
	VideoConferenceManager,
	VideoConferenceEngine,
	LocalAudioTrack,
	LocalVideoTrack
} from "@/consultation/call/helpers/types/video_conference_manager"

import Stub from "$/singletons/stub"
import isUndefined from "$/type_guards/is_undefined"

let videoConferenceManager: VideoConferenceManager|null = null
function manager(): VideoConferenceManager {
	return videoConferenceManager as VideoConferenceManager
}

export let videoConferenceEngine: VideoConferenceEngine|null = null
function engine(): VideoConferenceEngine {
	return videoConferenceEngine as VideoConferenceEngine
}

export async function initiateVideoConferenceEngine() {
	if (!isUndefined(window)) {
		// @ts-ignore
		videoConferenceManager = await import("agora-rtc-sdk-ng") as VideoConferenceManager
		videoConferenceEngine = videoConferenceManager.createClient({
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
	channelName: string,
	chatMessageActivityID: string,
	localParticipantID: string,
	token: string
) {
	await engine().join(
		appId,
		channelName,
		token,
		Number(chatMessageActivityID)
	)
	localTracks.localAudioTrack = await manager().createMicrophoneAudioTrack()
	localTracks.localVideoTrack = await manager().createCameraVideoTrack()

	await engine().publish([
		localTracks.localAudioTrack,
		localTracks.localVideoTrack
	])
	localTracks.localVideoTrack.play(localParticipantID)
}

export function leaveAndRemoveLocalTracks() {
	localTracks.localAudioTrack?.close()
	localTracks.localVideoTrack?.close()
}

export function mockJoining() {
	localTracks.localAudioTrack = Stub.runConditionally(
		manager().createMicrophoneAudioTrack,
		(): any => "this runs on test"
	) as unknown as any
	localTracks.localVideoTrack = Stub.runConditionally(
		manager().createMicrophoneAudioTrack,
		(): any => "this runs on test"
	) as unknown as any
}

export function muteVideoTrack() {
	Stub.runConditionally(
		() => {
			localTracks.localVideoTrack?.setMuted(true)
		},
		() => {
			localTracks.localVideoTrack = {
				"muted": true
			} as any

			return [
				0 as unknown as undefined,
				{
					"arguments": [],
					"functionName": "muteVideoTrack"
				}
			]
		}
	)
}
export function unmuteVideoTrack() {
	Stub.runConditionally(
		() => {
			localTracks.localVideoTrack?.setMuted(false)
		},
		() => {
			localTracks.localVideoTrack = {
				"muted": false
			} as any

			return [
				0 as unknown as undefined,
				{
					"arguments": [],
					"functionName": "unmuteVideoTrack"
				}
			]
		}
	)
}
export function muteAudioTrack() {
	localTracks.localAudioTrack?.setMuted(true)
}
export function unmuteAudioTrack() {
	localTracks.localAudioTrack?.setMuted(false)
}
