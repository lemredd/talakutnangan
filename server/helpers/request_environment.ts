import { StatusCodes } from "http-status-codes"

import { Environment } from "$/types/server"
import getRoot from "!/helpers/get_root"
import getEnvironment from "!/helpers/get_environment"

/**
 * Contains the environment that can be used by the request handlers.
 */
export default class RequestEnvironment {
	static get environment(): Environment { return getEnvironment() }

	static get root(): string { return getRoot() }

	static get status() { return StatusCodes }

	static get isOnTest(): boolean {
		const environment = this.environment
		return environment === Environment.UnitTest || environment === Environment.IntegrationTest
	}

	get environment(): Environment { return getEnvironment() }

	get root(): string { return getRoot() }

	get status() { return StatusCodes }

	get isOnTest(): boolean { return RequestEnvironment.isOnTest }
}
