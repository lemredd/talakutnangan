import stringifyQuery from "./stringify_query"

describe("Fetcher: Stringify query", () => {
	it("can stringify query object", () => {
		const queryObject = {
			"hello": "world",
			"foo": {
				"bar": true,
				"baz": "fum"
			}
		}

		const query = stringifyQuery(queryObject)

		expect(query).toEqual(encodeURI("hello=world&foo[bar]=true&foo[baz]=fum"))
	})

	it("can stringify with nested array", () => {
		const queryObject = {
			"hello": [ "world", "universe" ],
			"foo": {
				"bar": [ "baz", "fuzz" ]
			}
		}

		const query = stringifyQuery(queryObject)

		expect(query).toEqual(
			`hello=${encodeURIComponent("world,universe")}&foo${
				encodeURIComponent("[bar]")
			}=${encodeURIComponent("baz,fuzz")}`
		)
	})
})
