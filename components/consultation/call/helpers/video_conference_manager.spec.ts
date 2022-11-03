import {
	videoConferenceEngine,
	initiateVideoConferenceEngine
} from "./video_conference_manager"

describe("Helper: video conference manager", () => {
	it("can initiate the client engine", async() => {
		await initiateVideoConferenceEngine()

		expect(videoConferenceEngine).toBeTruthy()
	})
})
