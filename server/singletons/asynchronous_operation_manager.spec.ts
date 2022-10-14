import type { AuthenticatedRequest } from "!/types/dependent"

import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import MockRequester from "~/setups/mock_requester"
import AsynchronousFileManager from "%/managers/asynchronous_file"

import Singleton from "./asynchronous_operation_manager"

describe("Server singleton: Asynchronous operation manager", () => {
	const requester = new MockRequester<AuthenticatedRequest>()

	it("can initialize properly with new operation", async() => {
		const singleton = new Singleton()
		const user = await new UserFactory().serializedOne(true)

		requester.customizeRequest({
			"body": Buffer.alloc(0),
			user
		})

		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			4
		)

		expect(singleton.isNew).toBeTruthy()
	})
})
