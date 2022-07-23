import generateProperRules from "./generate_proper_rules"

describe("Helpers: Generate proper rules", () => {
	it("can retain if no array notations", () => {
		const body = { a: { b: 1 } }
		const rules = { "a.b": [] }

		const properRules = generateProperRules(body, rules)

		expect(properRules).toStrictEqual({ "a.b": [] })
	})

	it("can iterate first level", () => {
		const body = { a: [ { b: 1 }, { b: 2 } ] }
		const rules = { "a.*.b": [ "required" ] }

		const properRules = generateProperRules(body, rules)

		expect(properRules).toStrictEqual({
			"a.0.b": [ "required" ],
			"a.1.b": [ "required" ]
		})
	})

	it("can iterate second level", () => {
		const body = {
			a: [
				{
					b: [
						{ c: [] },
						{ c: [] }
					]
				}, {
					b: [
						{ c: [] },
						{ c: [] }
					]
				}
			]
		}
		const rules = { "a.*.b.*.c": [ "required" ] }

		const properRules = generateProperRules(body, rules)

		expect(properRules).toStrictEqual({
			"a.0.b.0.c": [ "required" ],
			"a.0.b.1.c": [ "required" ],
			"a.1.b.0.c": [ "required" ],
			"a.1.b.1.c": [ "required" ]
		})
	})

	it("cannot iterate inconsistent level", () => {
		const body = {
			a: [
				{
					b: [
						{ c: [] },
						{ c: [] }
					]
				}, {
					b: []
				}, {
					b: [
						{ c: [] },
						{ c: [] }
					]
				}
			]
		}
		const rules = { "a.*.b.*.c": [ "required" ] }

		const properRules = generateProperRules(body, rules)

		expect(properRules).toStrictEqual({
			"a.0.b.0.c": [ "required" ],
			"a.0.b.1.c": [ "required" ],
			"a.2.b.0.c": [ "required" ],
			"a.2.b.1.c": [ "required" ]
		})
	})

	it("can mix different levels", () => {
		const body = {
			a: [
				{
					b: [
						{ c: [] },
						{ c: [] }
					]
				}, {
					b: 0
				}, {
					b: [
						{ c: [] },
						{ c: [] }
					]
				}
			]
		}
		const rules = { "a.*.b.*.c": [ "required" ], "a.*.b": [ "nullable" ] }

		const properRules = generateProperRules(body, rules)

		expect(properRules).toStrictEqual({
			"a.0.b.0.c": [ "required" ],
			"a.0.b.1.c": [ "required" ],
			"a.1.b.*.c": [ "required" ],
			"a.2.b.0.c": [ "required" ],
			"a.2.b.1.c": [ "required" ],
			"a.0.b": [ "nullable" ],
			"a.1.b": [ "nullable" ],
			"a.2.b": [ "nullable" ]
		})
	})

	it("can retain rule if no matched array", () => {
		const body = { "a": 0 }
		const rules = { "a.*.b.*.c": [ "required" ] }

		const properRules = generateProperRules(body, rules)

		expect(properRules).toStrictEqual({ "a.*.b.*.c": [ "required" ] })
	})
})
