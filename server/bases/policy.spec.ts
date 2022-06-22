import MockRequester from "~/set-ups/mock_requester"

import Policy from "./policy"

describe("Back-end Base: Policy", () => {
	const requester = new MockRequester()

	it("can allow user", async () => {
		class PolicyA extends Policy {
			mayAllow(): boolean { return true }
		}
		const policy = new PolicyA()

		await requester.runMiddleware(policy.intermediate.bind(policy))

		requester.expectSuccess()
	})

	it("can deny user", async () => {
		class PolicyB extends Policy {
			mayAllow(): boolean { return false }
		}
		const policy = new PolicyB()

		await requester.runMiddleware(policy.intermediate.bind(policy))

		requester.expectFailure(requester.status.UNAUTHORIZED)
	})
})
