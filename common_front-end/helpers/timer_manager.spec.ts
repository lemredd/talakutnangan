import type { ConsultationListeners } from "$@/types/dependent"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import TimerManager from "./timer_manager"

describe("Helper: Timer manager", () => {
	it("can add event listeners and handle events", () => {
		const mockFinish = jest.fn().mockResolvedValueOnce(false)
		const mockConsumedTime = jest.fn()
		const consultationResource = {
			"id": "1",
			"scheduledStartAt": new Date(Date.now() - convertTimeToMilliseconds("00:04:58"))
		} as DeserializedConsultationResource
		const listeners: ConsultationListeners = {
			"consumedTime": mockConsumedTime,
			"finish": mockFinish
		}

		TimerManager.listenAllConsultationTimeEvents(consultationResource, listeners)
		TimerManager.nextInterval()

		expect(mockFinish).toHaveBeenCalled()
		expect(mockFinish.mock.calls).toEqual([ [ consultationResource ] ])
	})

	it("can remove listeners on successful update of finished consultation", () => {
		const mockFinish = jest.fn().mockResolvedValueOnce(true)
		const mockConsumedTime = jest.fn()
		const consultationResource = {
			"id": "1",
			"scheduledStartAt": new Date(Date.now() - convertTimeToMilliseconds("00:04:59"))
		} as DeserializedConsultationResource
		const listeners: ConsultationListeners = {
			"consumedTime": mockConsumedTime,
			"finish": mockFinish
		}

		TimerManager.listenAllConsultationTimeEvents(consultationResource, listeners)
		TimerManager.nextInterval()

		expect(mockFinish).toHaveBeenCalled()
		expect(mockFinish.mock.calls).toEqual([ [ consultationResource ] ])
	})
})
