import type { Serializable } from "$/types/general"

import ResponseInfo from "!/bases/response_info"
import RequestEnvironment from "$/singletons/request_environment"

export default class extends ResponseInfo {
	constructor(body: Serializable) {
		super(RequestEnvironment.status.ACCEPTED, body)
	}
}
