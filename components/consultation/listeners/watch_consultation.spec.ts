import { ref, nextTick, Ref } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"

import listener from "./watch_consultation"

describe("Listener: Consultation watcher", () => {
	afterEach(() => {
		ConsultationTimerManager.clearAllListeners()
	})

	it("can register listeners", async() => {
		const consultation = ref({
			"finishedAt": null,
			"id": 1,
			"startedAt": null,
			"type": "consultation"
		}) as unknown as Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>
		const finishConsultation = jest.fn()
		const registerListeners = jest.fn()
		listener(consultation, registerListeners, finishConsultation)

		consultation.value = {
			...consultation.value,
			"startedAt": new Date()
		}
		await nextTick()

		expect(registerListeners).toHaveBeenCalled()
	})

	it("can force finish normally", async() => {
		const consultation = ref({
			"finishedAt": null,
			"id": 1,
			"startedAt": null,
			"type": "consultation"
		}) as unknown as Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>
		const finishConsultation = jest.fn()
		const registerListeners = jest.fn(newConsultation => {
			ConsultationTimerManager.listenConsultationTimeEvent(
				newConsultation,
				"finish",
				finishConsultation
			)
		})
		listener(consultation, registerListeners, finishConsultation)

		consultation.value = {
			...consultation.value,
			"startedAt": new Date()
		}
		await nextTick()
		consultation.value = {
			...consultation.value,
			"finishedAt": new Date()
		}
		await nextTick()

		expect(registerListeners).toHaveBeenCalled()
		expect(finishConsultation).toHaveBeenCalled()
	})

	it("can force finish an already started consultation", async() => {
		const consultation = ref({
			"finishedAt": null,
			"id": 1,
			"startedAt": new Date(),
			"type": "consultation"
		}) as unknown as Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>
		const finishConsultation = jest.fn()
		const registerListeners = jest.fn()
		ConsultationTimerManager.listenConsultationTimeEvent(
			consultation.value,
			"finish",
			finishConsultation
		)
		listener(consultation, registerListeners, finishConsultation)

		consultation.value = {
			...consultation.value,
			"finishedAt": new Date()
		}
		await nextTick()

		expect(registerListeners).not.toHaveBeenCalled()
		expect(finishConsultation).toHaveBeenCalled()
	})
})
