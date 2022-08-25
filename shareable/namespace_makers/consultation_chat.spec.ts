import makeConsultationChatNamespace from "./consultation_chat"

describe("Namespace maker: Consultation chat", () => {
	it("can make namepsace", () => {
		const consultationID = "1"

		const namespace = makeConsultationChatNamespace(consultationID)

		expect(namespace).toBe("/consultation/1/chat")
	})
})
