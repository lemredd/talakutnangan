import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import "~/setups/consultation_timer.setup"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "./consultation_timer_manager"

describe("Helper: Timer manager", () => {
	it("can add event listeners and handle events", () => {
		const mockFinish = jest.fn()
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

	it("can ignore already added event listener", () => {
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
			"consumedTime",
			mockConsumedTime
		)
		ConsultationTimerManager.nextInterval()

		expect(mockConsumedTime).toHaveBeenCalled()
		expect(mockConsumedTime.mock.calls).toEqual([ [
			consultationResource,
			convertTimeToMilliseconds("00:00:01")
		] ])
	})

	it("can remove listeners by force", () => {
		const mockFinish = jest.fn()
		const mockOtherFinish = jest.fn()
		const consultationResource = {
			"finishedAt": new Date(),
			"id": "1"
		} as DeserializedConsultationResource
		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"finish",
			mockOtherFinish
		)
		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"finish",
			mockFinish
		)

		ConsultationTimerManager.unlistenConsultationTimeEvent(
			consultationResource,
			"finish",
			mockFinish
		)
		ConsultationTimerManager.nextInterval()

		expect(mockFinish).not.toHaveBeenCalled()
		expect(mockOtherFinish).toHaveBeenCalledTimes(1)
		expect(mockOtherFinish.mock.calls).toEqual([ [ consultationResource ] ])
	})

	it("can restart time and call corresponding listeners", () => {
		const mockReset = jest.fn()
		const consultationResource = {
			"id": "1",
			"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:02"))
		} as DeserializedConsultationResource

		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"restartTime",
			mockReset
		)
		ConsultationTimerManager.restartTimerFor(consultationResource)

		expect(mockReset).toHaveBeenCalled()
		expect(mockReset.mock.calls).toEqual([ [
			consultationResource
		] ])
	})

	it("can force finish the consultation and call corresponding listeners", () => {
		const mockFinish = jest.fn()
		const consultationResource = {
			"id": "1",
			"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:02"))
		} as DeserializedConsultationResource

		ConsultationTimerManager.listenConsultationTimeEvent(
			consultationResource,
			"finish",
			mockFinish
		)
		ConsultationTimerManager.forceFinish(consultationResource)

		expect(mockFinish).toHaveBeenCalled()
		expect(mockFinish.mock.calls).toEqual([ [
			consultationResource
		] ])
	})

	it("can renew remaining seconds", () => {
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
		ConsultationTimerManager.travelTimeTo(
			consultationResource,
			convertTimeToMilliseconds("00:00:10")
		)

		expect(mockConsumedTime).toHaveBeenCalled()
		expect(mockConsumedTime.mock.calls).toEqual([ [
			consultationResource,
			convertTimeToMilliseconds("00:00:10")
		] ])
	})

	it("should ignore renewal if it is already finished", () => {
		const mockConsumedTime = jest.fn()
		const mockFinish = jest.fn()
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
		ConsultationTimerManager.travelTimeTo(
			consultationResource,
			convertTimeToMilliseconds("00:00:10")
		)

		expect(mockFinish).toHaveBeenCalled()
		expect(mockConsumedTime).toHaveBeenCalled()
		expect(mockConsumedTime).toHaveBeenCalledTimes(1)
	})
})
