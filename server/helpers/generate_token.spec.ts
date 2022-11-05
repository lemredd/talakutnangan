import helper from "./generate_token"

describe("Helper: token generator", () => {
	it("can generate token", () => {
		const channelName = "channel"
		const uid = 2882341273
		const token = helper(channelName, uid)

		expect(token).not.toEqual("")
	})
})
