import { EntityManager } from "typeorm"

import { Environment } from "!/types"
import getEnvironment from "!/helpers/get_environment"

/**
 * Contains the environment that can be used by the request handlers.
 */
export default class RequestEnvironment {
	static #current: RequestEnvironment|null

	#manager: EntityManager
	constructor(manager: EntityManager) {
		this.#manager = manager
	}

	static get current(): RequestEnvironment {
		return this.#current
		|| throw new EvalError("Cannot get an uninitialized request environment.")
	}

	static intialize(manager: EntityManager) {
		if(!RequestEnvironment.#current) {
			RequestEnvironment.#current = new RequestEnvironment(manager)
		}
	}

	static destroy() {
		const environment = getEnvironment()

		if (environment === Environment.UnitTest || environment === Environment.IntegrationTest) {
			RequestEnvironment.#current = null
		}
	}

	get manager(): EntityManager { return this.#manager }

	get environment(): Environment { return getEnvironment() }
}
