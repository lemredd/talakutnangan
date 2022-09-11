import ResponseInfo from "!/bases/response_info"

import type { Serializable } from "$/types/general"
import RequestEnvironment from "$/singletons/request_environment"

export default class extends ResponseInfo {
	constructor(body: Serializable) {
		super(RequestEnvironment.status.OK, body)
	}
}
