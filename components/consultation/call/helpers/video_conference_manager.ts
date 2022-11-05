import type {
	VideoConferenceManager,
	VideoConferenceEngine,

	LocalTracks,

	RemoteUser,
	RemoteAudioTrack,
	RemoteVideoTrack,
	RemoteTracks,
	MediaType
} from "@/consultation/call/helpers/types/video_conference_manager"

import Stub from "$/singletons/stub"
import isUndefined from "$/type_guards/is_undefined"
import { Ref } from "vue"

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

function handleRemoteUserJoining(
	user: RemoteUser,
	mediaType: MediaType,
	remoteParticipants: Ref<RemoteTracks[]>
) {
	Stub.runConditionally(
		async() => {
			await engine().subscribe(user, mediaType)
			const remoteID = `user-${String(user.uid)}`
			remoteParticipants.value.push({
				"remoteAudioTrack": user.audioTrack as RemoteAudioTrack,
				remoteID,
				"remoteVideoTrack": user.videoTrack as RemoteVideoTrack
			})

			if (mediaType === "video") user.videoTrack?.play(remoteID)
			if (mediaType === "audio") user.audioTrack?.play()
		},
		() => {
			remoteParticipants.value.push({
				"remoteAudioTrack": user.audioTrack as RemoteAudioTrack,
				"remoteID": "user-remote-id",
				"remoteVideoTrack": user.videoTrack as RemoteVideoTrack
			})

			return [
				Promise.resolve(),
				{
					"arguments": [
						user,
						mediaType,
						remoteParticipants
					],
					"functionName": "handleRemoteUserJoining"
				}
			]
		}
	)
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
			(user, mediaType) => handleRemoteUserJoining(user, mediaType, remoteParticipants)
		)
	}
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
	videoConferenceEngine = videoConferenceEngine as VideoConferenceEngine
	videoConferenceManager = videoConferenceManager as VideoConferenceManager

	localTracks.localAudioTrack?.close()
	localTracks.localVideoTrack?.close()
}

export function mockJoining() {
	videoConferenceManager = videoConferenceManager as VideoConferenceManager
	localTracks.localAudioTrack = Stub.runConditionally(
		videoConferenceManager.createMicrophoneAudioTrack,
		(): any => "this runs on test"
	) as unknown as any
	localTracks.localVideoTrack = Stub.runConditionally(
		videoConferenceManager.createMicrophoneAudioTrack,
		(): any => "this runs on test"
	) as unknown as any
}
