import { Ref } from "vue"

import { GENERAL_SUCCESS_MESSAGE } from "$@/constants/messages"

export default function(
	receivedErrors: Ref<string[]>,
	successMessages: Ref<string[]>,
	newMessage?: string,
	mustOverride?: boolean
) {
	if (receivedErrors.value.length) receivedErrors.value = []

	if (newMessage) {
		const isMessageGeneric = successMessages.value[0] === GENERAL_SUCCESS_MESSAGE
		if (isMessageGeneric || mustOverride) successMessages.value = []
		successMessages.value.push(newMessage)
	} else {
		successMessages.value = []
		successMessages.value.push(GENERAL_SUCCESS_MESSAGE)
	}
}
