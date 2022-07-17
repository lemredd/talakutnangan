import type {
	UserProfile,
	StudentProfileData,
	ReachableEmployeeProfileData,
	UnreachableEmployeeProfileData
} from "$/types/common_front-end"
import makeDefaultPassword from "./make_default_password"

describe("Helpers: Make default password", () => {
	it("can generate for student", () => {
		const userProfile: UserProfile = {
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
						studentNumber: "0000-000"
					}
				}
			},
		}

		const password = makeDefaultPassword(userProfile)

		expect(password).toBe("0000-000")
	})
})
