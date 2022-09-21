import MockRequester from "~/setups/mock_requester"

import BaseError from "$!/errors/base"
import Policy from "./policy"

describe("Back-end Base: Policy", () => {
	const requester = new MockRequester()

	it("can allow user", async () => {
		class PolicyA extends Policy {
			async authorize(): Promise<void> { return }
		}
		const policy = new PolicyA()

		await requester.runMiddleware(policy.intermediate.bind(policy))

		requester.expectSuccess()
	})

	it("can deny user", async () => {
		class PolicyB extends Policy {
			async authorize(): Promise<void> { throw new BaseError("", 400, "", "") }
		}
		const policy = new PolicyB()

		await requester.runMiddleware(policy.intermediate.bind(policy))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(BaseError)
			]
		])
	})
})
