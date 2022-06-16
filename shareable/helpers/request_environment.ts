import { StatusCodes } from "http-status-codes"

import { Environment } from "$/types/server"
import getEnvironment from "$/helpers/get_environment"

/**
 * Contains the environment information that can be used by the any part of the repository.
 */
export default class RequestEnvironment {
	static get environment(): Environment { return getEnvironment() }

	static get status() { return StatusCodes }

	static get isOnTest(): boolean {
		const environment = this.environment
		return environment === Environment.UnitTest || environment === Environment.IntegrationTest
	}

	get environment(): Environment { return getEnvironment() }

	get status() { return StatusCodes }

	get isOnTest(): boolean { return RequestEnvironment.isOnTest }
}
