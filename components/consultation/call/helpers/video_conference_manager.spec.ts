import { ref } from "vue"

import {
	videoConferenceEngine,
	initiateVideoConferenceEngine,

	localTracks,
	joinAndPresentLocalTracks,
	leaveAndRemoveLocalTracks,
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
})
