import ResponseInfo from "!/bases/response_info"

import type { Serializable } from "$/types/database"
import RequestEnvironment from "$/helpers/request_environment"

export default class extends ResponseInfo {
	constructor(body: Serializable) {
		super(RequestEnvironment.status.OK, body)
	}
}
