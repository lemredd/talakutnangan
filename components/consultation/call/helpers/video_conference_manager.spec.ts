import { ref } from "vue"

import {
	videoConferenceEngine,
	initiateVideoConferenceEngine,
	muteVideoTrack,
	unmuteVideoTrack,
	muteAudioTrack,
	unmuteAudioTrack,

	localTracks,
	joinAndPresentLocalTracks,
	leaveAndRemoveLocalTracks
} from "./video_conference_manager"

describe("Helper: video conference manager", () => {
	describe("engine initiation", () => {
		it("can initiate the client engine", async() => {
			await initiateVideoConferenceEngine(ref<any[]>([]))

			expect(videoConferenceEngine).toBeTruthy()
		})
	})

	describe("local track states", () => {
		it("can generate local tracks", () => {
			joinAndPresentLocalTracks(
				"",
				"",
				"",
				"",
				""
			)

			expect(localTracks.localAudioTrack).toBeTruthy()
			expect(localTracks.localVideoTrack).toBeTruthy()
		})

		it("can close local tracks", () => {
			joinAndPresentLocalTracks(
				"",
				"",
				"",
				"",
				""
			)
			leaveAndRemoveLocalTracks()

			expect(localTracks.localAudioTrack).toBeFalsy()
			expect(localTracks.localVideoTrack).toBeFalsy()
		})
	})

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
