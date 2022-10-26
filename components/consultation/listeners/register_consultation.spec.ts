import { nextTick, ref, Ref } from "vue"

import type {
	ConsultationDocument,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import Stub from "$/singletons/stub"
import Socket from "$@/external/socket"
import makeConsultationNamespace from "$/namespace_makers/consultation"
import makeConsultationListOfUserNamespace from "$/namespace_makers/consultation_list_of_user"

import listener from "./register_consultation"

describe("Listener: Consultation", () => {
	it("can start consultation from others", async() => {
		Socket.initialize()

		const id = "1"
		const consultationNamespace = makeConsultationNamespace(id)

		const consultation = ref({ id }) as unknown
		const consultations = ref([ consultation ]) as any
		listener(
			consultation as Ref<
				DeserializedConsultationResource<"consultant"|"consultantRole">
			>,
			consultations,
			"1"
		)

		jest.useFakeTimers()

		Socket.emitMockEvent(consultationNamespace, "update", {
			"data": {
				"attributes": {
					"startedAt": new Date().toJSON()
				},
				id,
				"type": "consultation"
			}
		} as unknown as ConsultationDocument)
		await nextTick()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty("1.arguments.0", consultationNamespace)
		expect(previousCalls).toHaveProperty("1.arguments.1.update")
	})

	it.only("can receive incoming consultation", async() => {
		Socket.initialize()

		const id = "1"
		const consultationNamespace = makeConsultationNamespace(id)
		const consultationListOfUserNamespace = makeConsultationListOfUserNamespace(id)

		const consultation = ref({ id }) as unknown
		const consultations = ref({
			"data": [ consultation ]
		}) as any
		listener(
			consultation as Ref<
				DeserializedConsultationResource<"consultant"|"consultantRole">
			>,
			consultations,
			"1"
		)

		jest.useFakeTimers()

		Socket.emitMockEvent(consultationListOfUserNamespace, "create", {
			"attributes": {
				"startedAt": new Date().toJSON()
			},
			id,
			"type": "consultation"
		})
		await nextTick()

		console.log(consultationListOfUserNamespace, "\n\n\n")
		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty("1.arguments.0", consultationNamespace)
		expect(previousCalls).toHaveProperty("1.arguments.1.update")
		expect(previousCalls).toHaveProperty("2.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty("2.arguments.0", consultationListOfUserNamespace)
		expect(previousCalls).toHaveProperty("2.arguments.1.create")
	})
})
