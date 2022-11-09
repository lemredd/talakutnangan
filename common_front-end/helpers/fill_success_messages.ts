import { Ref } from "vue"

import { GENERAL_ERROR_MESSAGE } from "$@/constants/messages"

import type { UnitError } from "$/types/server"
import type { Response } from "$@/types/independent"

type SpecificResponse = Response<any, any, any, any, any, any>

export default function(
	response: SpecificResponse,
	receivedErrors: Ref<string[]>,
	successMessages?: Ref<string[]>
) {
	const { body } = response

	if (successMessages?.value.length) successMessages.value = []
	if (body) {
		const { errors } = body
		receivedErrors.value = errors.map((error: UnitError) => error.detail)
	} else {
		receivedErrors.value = [ GENERAL_ERROR_MESSAGE ]
	}
}
