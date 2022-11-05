import type { Ref } from "vue"
import type {
	VideoConferenceManager,
	VideoConferenceEngine,

	LocalTracks,
	RemoteTracks
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
			(user, mediaType) => handleRemoteUserJoining(engine, user, mediaType, remoteParticipants)
		)
	}
}

export function joinAndPresentLocalTracks(
	appId: string,
	channelName: string,
	chatMessageActivityID: string,
	localParticipantID: string,
	token: string
) {
	Stub.runConditionally(
		async() => {
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
