import type { Ref } from "vue"
import type {
	VideoConferenceManager,
	VideoConferenceEngine,

	LocalTracks,
	RemoteUser,
	RemoteTracks,
	MediaType
} from "@/consultation/call/helpers/types/video_conference_manager"

import Stub from "$/singletons/stub"
import isUndefined from "$/type_guards/is_undefined"

import {
	handleRemoteUserJoining
} from "@/consultation/call/helpers/video_conference_event_listeners"

let videoConferenceManager: VideoConferenceManager|null = null
function manager(): VideoConferenceManager {
	return videoConferenceManager as VideoConferenceManager
}

export let videoConferenceEngine: VideoConferenceEngine|null = null
function engine(): VideoConferenceEngine {
	return videoConferenceEngine as VideoConferenceEngine
}

export const localTracks: LocalTracks = {
	"localAudioTrack": null,
	"localVideoTrack": null
}

export async function initiateVideoConferenceEngine(remoteParticipants: Ref<RemoteTracks[]>) {
	if (!isUndefined(window)) {
		// @ts-ignore
		videoConferenceManager = await import("agora-rtc-sdk-ng") as VideoConferenceManager
		videoConferenceEngine = videoConferenceManager.createClient({
			"codec": "vp8",
			"mode": "rtc"
		})

		videoConferenceEngine.on(
			"user-published",
			(user: RemoteUser, mediaType: MediaType) => {
				handleRemoteUserJoining(engine, user, mediaType, remoteParticipants)
			}
		)
	}
}

export function joinAndPresentLocalTracks(
	appId: string,
	channelName: string,
	chatMessageActivityID: string,
	localParticipantID: string,
	token: string,
	trackStates: {
		isShowingVideo: boolean,
		isTransmittingAudio: boolean
	}
) {
	Stub.runConditionally(
		async() => {
			await engine().join(
				appId,
				channelName,
				token,
				Number(chatMessageActivityID)
			)
			const { isShowingVideo, isTransmittingAudio } = trackStates

			if (isShowingVideo) {
				localTracks.localVideoTrack = await manager().createCameraVideoTrack()
				await engine().publish(localTracks.localVideoTrack)
				localTracks.localVideoTrack.play(localParticipantID)
			}

			if (isTransmittingAudio) {
				localTracks.localAudioTrack = await manager().createMicrophoneAudioTrack()
				await engine().publish(localTracks.localAudioTrack)
			}
		},
		() => {
			localTracks.localAudioTrack = "this runs on test" as any
			localTracks.localVideoTrack = "this runs on test" as any

			return [
				Promise.resolve(),
				{
					"arguments": [
						appId,
						channelName,
						chatMessageActivityID,
						localParticipantID,
						token
					],
					"functionName": "joinAndPresentLocalTracks"
				}
			]
		}
	)
}

export function leaveAndRemoveLocalTracks() {
	Stub.runConditionally(
		async() => {
			videoConferenceEngine = videoConferenceEngine as VideoConferenceEngine
			videoConferenceManager = videoConferenceManager as VideoConferenceManager

			localTracks.localAudioTrack?.close()
			localTracks.localVideoTrack?.close()

			await engine().leave()
		},
		() => {
			localTracks.localAudioTrack = null
			localTracks.localVideoTrack = null

			return [
				Promise.resolve(),
				{
					"arguments": [],
					"functionName": "leaveAndRemoveLocalTracks"
				}
			]
		}
	)
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
	Stub.runConditionally(
		() => {
			localTracks.localAudioTrack?.setMuted(true)
		},
		() => {
			localTracks.localAudioTrack = {
				"muted": true
			} as any

			return [
				0 as unknown as undefined,
				{
					"arguments": [],
					"functionName": "muteAudioTrack"
				}
			]
		}
	)
}
export function unmuteAudioTrack() {
	Stub.runConditionally(
		() => {
			localTracks.localAudioTrack?.setMuted(false)
		},
		() => {
			localTracks.localAudioTrack = {
				"muted": false
			} as any

			return [
				0 as unknown as undefined,
				{
					"arguments": [],
					"functionName": "unmuteAudioTrack"
				}
			]
		}
	)
}
