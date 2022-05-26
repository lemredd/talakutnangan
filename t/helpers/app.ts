import supertest from "supertest"
import type { Express } from "express"

import Database from "~/database"
import Router from "!/helpers/router"
import UserFactory from "~/factories/user"
import Controller from "!/helpers/controller"
import createAppHandler from "!/app/create_handler"

export default class {
	static #app: Express
	static #request

	static async create(prefix: string, controller: Controller) {
		const router = new Router(prefix)
		router.useController(controller)

		this.#app = await createAppHandler(Database.manager, router.combinedRouter)
		this.#request = supertest(this.#app)
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
