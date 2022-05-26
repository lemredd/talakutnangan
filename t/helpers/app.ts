import supertest from "supertest"
import type { Express } from "express"

import Database from "~/database"
import UserFactory from "~/factories/user"
import manageRoutes from "!/routes/manage_routes"
import createAppHandler from "!/app/create_handler"
import initializeSingletons from "!/helpers/initialize_singletons"

export default class {
	static #app: Express
	static #request

	static async create() {
		if (!this.#app) {
			initializeSingletons(Database.manager)
			this.#app = await createAppHandler(Database.manager, manageRoutes(Database.manager))
			this.#request = supertest(this.#app)
		}
	}

	static get request() {
		return this.#request
	}

	static async makeAuthenticatedCookie() {
		const user = await (new UserFactory()).insertOne()

		const response = await this.#request
			.post("/api/user/log_in")
			.send({
				email: user.email,
				password: user.password
			})

		return {
			user,
			cookie: response.headers["set-cookie"]
		}
	}
}
