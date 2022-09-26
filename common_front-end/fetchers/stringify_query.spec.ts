import stringifyQuery from "./stringify_query"

describe("Fetcher: Stringify query", () => {
	it("can stringify query object", () => {
		const queryObject = {
			"foo": {
				"bar": true,
				"baz": "fum"
			},
			"hello": "world"
		}

		const query = stringifyQuery(queryObject)

		expect(query).toEqual(encodeURI("hello=world&foo[bar]=true&foo[baz]=fum"))
	})

	it("can stringify with nested array", () => {
		const queryObject = {
			"foo": {
				"bar": [ "baz", "fuzz" ]
			},
			"hello": [ "world", "universe" ]
		}

		const query = stringifyQuery(queryObject)

		expect(query).toEqual(
			`hello=${encodeURIComponent("world,universe")}&foo${
				encodeURIComponent("[bar]")
			}=${encodeURIComponent("baz,fuzz")}`
		)
	})
})
