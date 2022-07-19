import RequestEnvironment from "$!/singletons/request_environment"
import Fetcher from "$@/communicators/fetcher"

describe("Communicator: Fetcher", () => {
	it("should error", async () => {
		const basePath = "/t/authorization_error"

		const response = await Fetcher.getJSON(basePath)

		console.log(response)
	})
})
