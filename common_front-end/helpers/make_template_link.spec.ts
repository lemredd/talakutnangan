import makeTemplateLink from "./make_template_link"

describe("Helper: Make link", () => {
	it("can make links", () => {
		const prefix = "/api/v1"
		const type = "user"

		const { bound, unbound } = makeTemplateLink(prefix, type)

		expect(bound).toBe(`${prefix}/${type}`)
		expect(unbound).toBe(`${prefix}/${type}/:id`)
	})
})
