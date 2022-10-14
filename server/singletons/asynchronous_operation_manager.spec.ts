import type { AuthenticatedRequest } from "!/types/dependent"

import "~/setups/database.setup"
import MockRequester from "~/setups/mock_requester"
import AsynchronousFileManager from "%/managers/asynchronous_file"

import Singleton from "./asynchronous_operation_manager"

describe("Server singleton: Asynchronous operation manager", () => {
	const requester = new MockRequester<AuthenticatedRequest>()

	it("can initialize properly", async() => {
		const singleton = new Singleton()
		requester.customizeRequest({
			"body": Buffer.alloc(0),
			"user": {
				"data": {
					"id": "1"
				}
			}
		})

		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			4
		)

		requester.expectSuccess()
	})
})
