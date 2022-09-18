import makeConsultationNamespace from "./consultation"

describe("Namespace maker: Consultation", () => {
	it("can make namepsace", () => {
		const consultationID = "1"

		const namespace = makeConsultationNamespace(consultationID)

		expect(namespace).toBe("/consultation/1/self")
	})
})
