import { EntityManager } from "typeorm"

import { Environment } from "!/types"
import getEnvironment from "!/helpers/get_environment"

/**
 * Contains the environment that can be used by the request handlers.
 */
export default class RequestEnvironment {
	static #current: RequestEnvironment|null = null

	#manager: EntityManager
	constructor(manager: EntityManager) {
		this.#manager = manager
	}

	/**
	 * If returned `null`, developer should initialize the request environment first.
	 */
	static get current(): RequestEnvironment { return this.#current }

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
