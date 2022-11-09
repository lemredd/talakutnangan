import { Ref } from "vue"

import { GENERAL_SUCCESS_MESSAGE } from "$@/constants/messages"

export default function(
	receivedErrors: Ref<string[]>,
	successMessages: Ref<string[]>,
	newMessage?: string
) {
	if (receivedErrors.value.length) receivedErrors.value = []

	if (newMessage) {
		if (successMessages.value[0] === GENERAL_SUCCESS_MESSAGE) successMessages.value = []
		successMessages.value.push(newMessage)
	} else {
		successMessages.value = []
		successMessages.value.push(GENERAL_SUCCESS_MESSAGE)
	}
}
