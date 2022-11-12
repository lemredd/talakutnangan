import { ref } from "vue"

import { GENERAL_SUCCESS_MESSAGE } from "$@/constants/messages"

import helper from "./fill_success_messages"

describe("Helper: fill success messages", () => {
	it("can produce success message", () => {
		const receivedErrors = ref<string[]>([])
		const successMessages = ref<string[]>([])
		const message1 = "message 1"
		const message2 = "message 2"
		const message3 = "message 3"


		helper(receivedErrors, successMessages, message1)
		expect(successMessages.value).toContainEqual(message1)
		helper(receivedErrors, successMessages, message2)
		expect(successMessages.value).toContainEqual(message2)
		helper(receivedErrors, successMessages, message3)
		expect(successMessages.value).toContainEqual(message3)
		expect(successMessages.value).toHaveLength(3)
		expect(receivedErrors.value).toHaveLength(0)
	})

	it("should use general message", () => {
		const receivedErrors = ref<string[]>([])
		const successMessages = ref<string[]>([])

		helper(receivedErrors, successMessages)

		expect(successMessages.value).toContainEqual(GENERAL_SUCCESS_MESSAGE)
		expect(receivedErrors.value).toHaveLength(0)
	})
})
