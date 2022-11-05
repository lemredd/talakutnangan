import {
	handleRemoteUserJoining
} from "./video_conference_event_listeners"

import { ref } from "vue"

describe("Listener: Handle remote user joining", () => {
	it("can detect remote user joining", () => {
		const engine = jest.fn()
		const remoteUser = {} as any
		const mediaType = "video"
		const remoteParticipants = ref<any[]>([])

		handleRemoteUserJoining(
			engine,
			remoteUser,
			mediaType,
			remoteParticipants
		)

		expect(remoteParticipants.value).not.toHaveLength(0)
	})
})
