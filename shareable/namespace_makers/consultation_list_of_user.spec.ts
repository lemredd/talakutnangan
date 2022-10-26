import makeConsultationListOfUserNamespace from "./consultation_list_of_user"

describe("Namespace maker: Consultation list of user", () => {
	it("can make namepsace", () => {
		const userID = "1"

		const namespace = makeConsultationListOfUserNamespace(userID)

		expect(namespace).toBe("/user/1/consultation")
	})
})
