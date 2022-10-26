import { nextTick, ref, Ref } from "vue"

import type {
	ConsultationDocument,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import Stub from "$/singletons/stub"
import Socket from "$@/external/socket"
import makeConsultationNamespace from "$/namespace_makers/consultation"

import listener from "./register_consultation"

describe("Listener: Consultation", () => {
	it("can start consultation from others", async() => {
		Socket.initialize()

		const id = "1"
		const consultationNamespace = makeConsultationNamespace(id)

		const consultation = ref({ id }) as unknown
		listener(
			consultation as Ref<
				DeserializedConsultationResource<"consultant"|"consultantRole">
			>,
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
})
