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
		const { environment } = this
		return environment === Environment.UnitTest || this.isOnIntegration
	}

	static get isOnIntegration(): boolean {
		const { environment } = this
		return environment === Environment.IntegrationTest
	}

	static get isNotOnProduction(): boolean {
		const { environment } = this
		return environment !== Environment.Production
	}

	get environment(): Environment { return getEnvironment() }

	get status() { return StatusCodes }

	get isOnTest(): boolean { return RequestEnvironment.isOnTest }

	get isOnIntegration(): boolean { return RequestEnvironment.isOnIntegration }

	get isNotOnProduction(): boolean { return RequestEnvironment.isNotOnProduction }
}
