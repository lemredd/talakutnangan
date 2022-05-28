import { DataSource, EntityManager } from "typeorm"

import { Environment } from "!/types"
import getEnvironment from "!/helpers/get_environment"

/**
 * Contains the environment that can be used by the request handlers.
 */
export default class RequestEnvironment {
	protected static dataSource: DataSource

	static intialize(source: DataSource) {
		RequestEnvironment.dataSource = source
	}

	static destroy() {
		const environment = getEnvironment()

		if (environment === Environment.UnitTest || environment === Environment.IntegrationTest) {
			RequestEnvironment.dataSource = null
		}
	}

	static get manager(): EntityManager { return RequestEnvironment.dataSource.manager }

	static get environment(): Environment { return getEnvironment() }

	get manager(): EntityManager { return RequestEnvironment.dataSource.manager }

	get environment(): Environment { return getEnvironment() }
}
