import supertest from "supertest"
import type { Express } from "express"

import { JSON_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import Role from "%/models/role"
import Router from "!/bases/router"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import createAppHandler from "!/app/create_handler"
import Controller from "!/bases/controller-likes/controller"
import LogInController from "!%/api/user/log_in.post"
import RequestEnvironment from "$!/singletons/request_environment"

export default class {
	static #app: Express
	// @ts-ignore
	static #request

	static async create(
		controller: Controller,
		needsAuthentication = true
	) {
		const router = new class extends Router {
			constructor() {
				super()
				this.useController(controller)
				if (needsAuthentication) this.useController(new LogInController())
			}
		}()
		this.#app = await createAppHandler(router)
		this.#request = supertest(this.#app)
	}

	static get request() {
		return this.#request
	}

	static async makeAuthenticatedCookie(
		role: Role|null = null,
		factoryModificationCallback: ((factory: UserFactory) => UserFactory)|null = null
	) {
		if (role === null) {
			// eslint-disable-next-line no-param-reassign
			role = await new RoleFactory().insertOne()
		}

		let userFactory = new UserFactory().attach(role).beUnreachableEmployee()
		if (factoryModificationCallback !== null) {
			userFactory = factoryModificationCallback(userFactory)
		}
		const user = await userFactory.insertOne()

		const response = await this.#request
		.post("/api/user/log_in")
		.type(JSON_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)
		.send({
			"email": user.email,
			"password": user.password
		})

		expect(response.status).toBe(RequestEnvironment.status.OK)

		return {
			"cookie": response.headers["set-cookie"],
			user
		}
	}
}
