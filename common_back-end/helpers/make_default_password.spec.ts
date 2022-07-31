import type { DeserializedUserProfile } from "$/types/documents/user"
import makeDefaultPassword from "./make_default_password"

describe("Helpers: Make default password", () => {
	it("can generate for student", () => {
		const userProfile: DeserializedUserProfile = {
			data: {
				type: "user",
				id: 1,
				name: "",
				email: "",
				kind: "student",
				roles: {
					data: []
				},
				studentDetail: {
					data: {
						id: 1,
						type: "student_detail",
						studentNumber: "0000-000"
					}
				}
			},
			meta: {
				hasDefaultPassword: false
			}
		}

		const password = makeDefaultPassword(userProfile)

		expect(password).toBe("0000-000")
	})

	it("can generate for reachable employee", () => {
		const userProfile: DeserializedUserProfile = {
			data: {
				type: "user",
				id: 1,
				name: "",
				email: "hello.world@example.com",
				kind: "reachable_employee",
				roles: {
					data: []
				},
				employeeSchedules: {
					data: []
				}
			},
			meta: {
				hasDefaultPassword: false
			}
		}

		const password = makeDefaultPassword(userProfile)

		expect(password).toBe("hello.world")
	})

	it("can generate for unreachable employee", () => {
		const userProfile: DeserializedUserProfile = {
			data: {
				type: "user",
				id: 1,
				name: "",
				email: "foo.bar@example.com",
				kind: "unreachable_employee",
				roles: {
					data: []
				}
			},
			meta: {
				hasDefaultPassword: false
			}
		}

		const password = makeDefaultPassword(userProfile)

		expect(password).toBe("foo.bar")
	})
})
