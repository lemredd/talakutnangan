import ResponseInfo from "!/bases/response_info"

import RequestEnvironment from "$/singletons/request_environment"

export default class extends ResponseInfo {
	constructor() {
		super(RequestEnvironment.status.NO_CONTENT, null)
	}
}
