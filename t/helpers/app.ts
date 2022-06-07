import supertest from "supertest"
import type { Express } from "express"

import Router from "!/bases/router"
import UserFactory from "~/factories/user"
import Controller from "!/bases/controller"
import LogInController from "!/app/routes/api/user/log_in.post"
import createAppHandler from "!/app/create_handler"

export default class {
	static #app: Express
	static #request

	static async create(
		prefix: string,
		controller: Controller,
		needsAuthentication: boolean = true
	) {
		const router = new class extends Router {
			constructor() {
				super()
				this.useController(controller)
				if (needsAuthentication) this.useController(new LogInController())
			}
		}
		this.#app = await createAppHandler(router)
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
