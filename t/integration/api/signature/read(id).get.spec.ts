import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import SignatureFactory from "~/factories/signature"
import RequestEnvironment from "$!/singletons/request_environment"

import { READ_OWN } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/signature/read(id).get"

describe("GET /api/signature/:id", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can read signature", async() => {
		const signature = await new SignatureFactory().insertOne()
		const studentRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_OWN))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			studentRole,
			userFactory => userFactory.beStudent())

		const response = await App.request
		.get(`/api/signature/${signature.id}`)
		.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toStrictEqual(signature.fileContents)
	})
})
