import type {
	VideoConferenceManager,
	VideoConferenceEngine,

	LocalAudioTrack,
	LocalVideoTrack,

	RemoteAudioTrack,
	RemoteVideoTrack
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

type LocalTracks = {
	"localAudioTrack": LocalAudioTrack|null
	"localVideoTrack": LocalVideoTrack|null
}
export const localTracks: LocalTracks = {
	"localAudioTrack": null,
	"localVideoTrack": null
}

type RemoteTracks = {
	chatMessageActivityID: string,
	remoteAudioTrack: RemoteAudioTrack|null,
    // A variable to hold a remote video track.
    remoteVideoTrack: RemoteVideoTrack|null,
}
const remoteParticipants: RemoteTracks[] = []


export async function initiateVideoConferenceEngine() {
	if (!isUndefined(window)) {
		// @ts-ignore
		videoConferenceManager = await import("agora-rtc-sdk-ng") as VideoConferenceManager
		videoConferenceEngine = videoConferenceManager.createClient({
			"codec": "vp8",
			"mode": "rtc"
		})

		videoConferenceEngine.on("user-published", async(user, mediaType) => {
			await engine().subscribe(user, mediaType)

			if (mediaType === "video") {

			}
		})
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
