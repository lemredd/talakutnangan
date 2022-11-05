import {
	localTracks,
	videoConferenceEngine,
	initiateVideoConferenceEngine,
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
})
