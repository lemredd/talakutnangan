import supertest from "supertest"
import type { Express } from "express"

import Router from "!/bases/router"
import UserFactory from "~/factories/user"
import Controller from "!/bases/controller"
import LogInController from "!/routes/api/user/log_in.post"
import createAppHandler from "!/app/create_handler"

export default class {
	static #app: Express
	static #request
	static #router
	static #hasLogInRoute = false

	static async create(prefix: string, controller: Controller) {
		const router = new class extends Router {
			get prefix(): string { return prefix }
		}
		router.useController(controller)
		this.#router = router
		this.#app = await createAppHandler(router.combinedRouter)
		this.#request = supertest(this.#app)
	}

	static get request() {
		return this.#request
	}

	static async makeAuthenticatedCookie() {
		if (!this.#hasLogInRoute) {
			this.#router.useController(new LogInController())
			this.#hasLogInRoute = true
		}

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
