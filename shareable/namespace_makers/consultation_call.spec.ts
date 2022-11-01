import makeConsultationCallNamespace from "./consultation_call"

describe("Namespace maker: Consultation call", () => {
	it("can make namepsace", () => {
		const consultationID = "1"

		const namespace = makeConsultationCallNamespace(consultationID)

		expect(namespace).toBe("/consultation/1/call")
	})
})
