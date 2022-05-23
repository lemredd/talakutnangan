import supertest from "supertest"
import type { Express } from "express"

import Database from "~/database"
import createAppHandler from "!/app/create_handler"

export default class {
	static #app: Express

	static async create() {
		this.#app = await createAppHandler(Database.manager)
	}

	static get request() {
		return supertest(this.#app)
	}
}
