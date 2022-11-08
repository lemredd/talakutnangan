import { ref } from "vue"

import { GENERAL_ERROR_MESSAGE } from "$@/constants/messages"

import helper from "./extract_all_error_details"

describe("Helper: handle_errors", () => {
	it("can get all error details", () => {
		const receivedErrors = ref<string[]>([])
		const successMessages = ref<string[]>([])
		const errors = [
			{
				"detail": "sample error 1"
			},
			{
				"detail": "sample error 2"
			},
			{
				"detail": "sample error 3"
			}
		]
		const response = {
			"body": {
				errors
			}
		} as any

		helper(response, receivedErrors, successMessages)

		expect(receivedErrors.value).toContainEqual(errors[0].detail)
		expect(receivedErrors.value).toContainEqual(errors[1].detail)
		expect(receivedErrors.value).toContainEqual(errors[2].detail)
		expect(successMessages.value).toHaveLength(0)
	})

	it("should use general error message", () => {
		const receivedErrors = ref<string[]>([])
		const successMessages = ref<string[]>([])
		const response = {} as any

		helper(response, receivedErrors, successMessages)

		expect(receivedErrors.value).toContainEqual(GENERAL_ERROR_MESSAGE)
		expect(successMessages.value).toHaveLength(0)
	})
})
