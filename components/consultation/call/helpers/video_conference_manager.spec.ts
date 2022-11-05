import {
	localTracks,
	videoConferenceEngine,
	initiateVideoConferenceEngine,
	muteVideoTrack,
	unmuteVideoTrack,
	muteAudioTrack,
	unmuteAudioTrack,
	mockJoining
} from "./video_conference_manager"

describe("Helper: video conference manager", () => {
	it("can initiate the client engine", async() => {
		await initiateVideoConferenceEngine()

		expect(videoConferenceEngine).toBeTruthy()
	})

	it("can generate local tracks", () => {
		mockJoining()

		expect(localTracks.localAudioTrack).toBeTruthy()
		expect(localTracks.localVideoTrack).toBeTruthy()
	})

	it.todo("can close local tracks")

	describe("muting", () => {
		it("can mute and unmute video track", () => {
			muteVideoTrack()
			const castedLocalVideoTrack = localTracks.localVideoTrack as any
			expect(castedLocalVideoTrack.muted).toBeTruthy()

			unmuteVideoTrack()
			expect(localTracks.localVideoTrack?.muted).toBeFalsy()
		})
	})

	describe("muting", () => {
		it("can mute and unmute audio track", () => {
			muteAudioTrack()
			const castedLocalAudioTrack = localTracks.localAudioTrack as any
			expect(castedLocalAudioTrack.muted).toBeTruthy()

			unmuteAudioTrack()
			expect(localTracks.localAudioTrack?.muted).toBeFalsy()
		})
	})
})
