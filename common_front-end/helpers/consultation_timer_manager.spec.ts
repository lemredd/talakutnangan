import flushPromises from "flush-promises"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import "~/setups/consultation_timer.setup"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "./consultation_timer_manager"

describe("Helper: Timer manager", () => {
	it("can add event listeners and handle events", () => {
		const mockFinish = jest.fn().mockResolvedValueOnce(false)
		const mockConsumedTime = jest.fn()
		const consultationResource = {
			"id": "1",
			"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:02"))
		} as DeserializedConsultationResource

		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"consumedTime",
			mockConsumedTime
		)
		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"finish",
			mockFinish
		)
		ConsultationTimerManager.nextInterval()

		expect(mockFinish).not.toHaveBeenCalled()
		expect(mockConsumedTime).toHaveBeenCalled()
		expect(mockConsumedTime.mock.calls).toEqual([ [
			consultationResource,
			convertTimeToMilliseconds("00:00:01")
		] ])
	})

	it("can remove listeners on successful update of finished consultation", async() => {
		const mockFinish = jest.fn().mockResolvedValueOnce(true)
		const mockConsumedTime = jest.fn()
		const consultationResource = {
			"id": "1",
			"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:01"))
		} as DeserializedConsultationResource

		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"consumedTime",
			mockConsumedTime
		)
		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"finish",
			mockFinish
		)
		ConsultationTimerManager.nextInterval()
		await flushPromises()
		ConsultationTimerManager.nextInterval()

		expect(mockConsumedTime).not.toHaveBeenCalled()
		expect(mockFinish).toHaveBeenCalledTimes(1)
		expect(mockFinish.mock.calls).toEqual([ [ consultationResource ] ])
	})
})
