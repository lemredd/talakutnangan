import { ref } from "vue"

import helper from "./merge_deserialized_messages"

describe("Helper: merge deserialized messages", () => {
	it("can merge previous messages with the latest ones", () => {
		const lastChatMessages = ref({ "data": [
			{ "id": "1" }
		] }) as any
		const previousMessages = [
			{ "id": "2" }
		] as any

		helper(lastChatMessages, previousMessages)

		expect(lastChatMessages.value.data).toContainEqual(previousMessages[0])
	})
})
