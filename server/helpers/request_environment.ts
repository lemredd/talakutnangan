import { Sequelize } from "sequelize-typescript"
import { StatusCodes } from "http-status-codes"

import { Environment } from "!/types"
import getEnvironment from "!/helpers/get_environment"
import getRoot from "!/helpers/get_root"

/**
 * Contains the environment that can be used by the request handlers.
 */
export default class RequestEnvironment {
	protected static dataSource: Sequelize

	static intialize(source: Sequelize) {
		RequestEnvironment.dataSource = source
	}

	static destroy() {
		const environment = getEnvironment()

		if (environment === Environment.UnitTest || environment === Environment.IntegrationTest) {
			RequestEnvironment.dataSource = null
		}
	}

	// static get manager() { return RequestEnvironment.dataSource.manager }

	static get environment(): Environment { return getEnvironment() }

	static get root(): string { return getRoot() }

	static get status() { return StatusCodes }

	// get manager() { return RequestEnvironment.dataSource.manager }

	get environment(): Environment { return getEnvironment() }

	get root(): string { return getRoot() }

	get status() { return StatusCodes }
}
