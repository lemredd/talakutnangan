import type { ConsultationListeners } from "$@/types/dependent"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import Stub from "$/singletons/stub"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import TimerManager from "./timer_manager"

describe("Helper: Timer manager", () => {
	it("can initialize", () => {
		TimerManager.initialize()

		const previousCalls = Stub.consumePreviousCalls()

		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
	})

	it("can add event listeners and handle events", async() => {
		jest.useRealTimers()
		TimerManager.initialize()
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
		await TimerManager.nextInterval()

		expect(mockFinish).toHaveBeenCalled()
		expect(mockFinish.mock.calls).toEqual([ [ consultationResource ] ])
	})

	it("can remove listeners on successful update of finished consultation", async() => {
		TimerManager.initialize()
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
		await TimerManager.nextInterval()

		expect(mockFinish).toHaveBeenCalled()
		expect(mockFinish.mock.calls).toEqual([ [ consultationResource ] ])
	})
})
