import supertest from "supertest"
import type { Express } from "express"

import Database from "~/database"
import createAppHandler from "!/app/create_handler"

export default class {
	static #app: Express
	static #request

	static async create() {
		if (!this.#app) {
			this.#app = await createAppHandler(Database.manager)
			this.#request = supertest(this.#app)
		}
	}

	static get request() {
		return this.#request
	}
}
