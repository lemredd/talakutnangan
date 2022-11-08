import { Ref } from "vue"
import type {
	VideoConferenceEngine,

	MediaType,
	RemoteUser,
	RemoteTracks,
	RemoteAudioTrack,
	RemoteVideoTrack
} from "@/consultation/call/helpers/types/video_conference_manager"

import Stub from "$/singletons/stub"

export function handleRemoteUserJoining(
	engine: () => VideoConferenceEngine,
	user: RemoteUser,
	mediaType: MediaType,
	remoteParticipants: Ref<RemoteTracks[]>
) {
	Stub.runConditionally(
		async() => {
			await engine().subscribe(user, mediaType)
			const remoteID = `user-${String(user.uid)}`
			const TIMEOUT = 3000
			remoteParticipants.value.push({
				"remoteAudioTrack": user.audioTrack as RemoteAudioTrack,
				remoteID,
				"remoteVideoTrack": user.videoTrack as RemoteVideoTrack
			})

			setTimeout(() => {
				if (mediaType === "video") user.videoTrack?.play(remoteID)
				if (mediaType === "audio") user.audioTrack?.play()
			}, TIMEOUT)
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
