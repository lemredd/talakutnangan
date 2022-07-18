import supertest from "supertest"
import type { Express } from "express"

import Role from "%/models/role"
import Router from "!/bases/router"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import createAppHandler from "!/app/create_handler"
import Controller from "!/bases/controller-likes/controller"
import LogInController from "!/app/routes/api/user/log_in.post"

export default class {
	static #app: Express
	// @ts-ignore
	static #request

	static async create(
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

	static async makeAuthenticatedCookie(
		role: Role|null = null,
		factoryModificationCallback: ((factory: UserFactory) => void)|null = null
	) {
		if (role === null) {
			role = await new RoleFactory().insertOne()
		}

		const userFactory = new UserFactory().attach(role)
		if (factoryModificationCallback !== null) {
			factoryModificationCallback(userFactory)
		}
		const user = await userFactory.insertOne()

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
