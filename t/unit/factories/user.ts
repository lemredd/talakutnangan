import { faker } from "@faker-js/faker"
import User from "!/models/user"
import Factory from "~/factory"

export default class extends Factory<User> {
	constructor() {
		super(User)
	}

	generate() {
		return {
			email: faker.internet.exampleEmail(),
			password: "password"
		}
	}
}
