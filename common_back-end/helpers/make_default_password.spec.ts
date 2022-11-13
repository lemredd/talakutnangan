import type { DeserializedUserProfile } from "$/types/documents/user"
import makeDefaultPassword from "./make_default_password"

describe("Helpers: Make default password", () => {
	it("can generate for student", () => {
		const userProfile: DeserializedUserProfile<"studentDetail"> = {
			"data": {
				"email": "",
				"emailVerifiedAt": null,
				"id": "1",
				"kind": "student",
				"name": "",
				"prefersDark": false,
				"studentDetail": {
					"data": {
						"id": "1",
						"studentNumber": "0000-000",
						"type": "student_detail"
					}
				},
				"type": "user"
			},
			"meta": {
				"hasDefaultPassword": false
			}
		}

		const password = makeDefaultPassword(userProfile)

		expect(password).toBe("0000-000")
	})

	it("can generate for reachable employee", () => {
		const userProfile: DeserializedUserProfile = {
			"data": {
				"email": "hello.world@example.com",
				"emailVerifiedAt": null,
				"id": "1",
				"kind": "reachable_employee",
				"name": "",
				"prefersDark": false,
				"type": "user"
			},
			"meta": {
				"hasDefaultPassword": false
			}
		}

		const password = makeDefaultPassword(userProfile)

		expect(password).toBe("hello.world")
	})

	it("can generate for unreachable employee", () => {
		const userProfile: DeserializedUserProfile = {
			"data": {
				"email": "foo.bar@example.com",
				"emailVerifiedAt": null,
				"id": "1",
				"kind": "unreachable_employee",
				"name": "",
				"prefersDark": false,
				"type": "user"
			},
			"meta": {
				"hasDefaultPassword": false
			}
		}

		const password = makeDefaultPassword(userProfile)

		expect(password).toBe("foo.bar")
	})
})
