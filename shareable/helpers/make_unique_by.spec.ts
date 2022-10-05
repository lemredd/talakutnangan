import helper from "./make_unique_by"

describe("Helper: make unique by", () => {
	it("can prune duplicates based on identity", () => {
		const obj1 = { "foo": 1 }
		const obj2 = { "foo": 1 }
		const obj3 = { "foo": 2 }
		const objArray = [ obj1, obj2, obj3 ]

		expect(helper(objArray, "foo")).toHaveLength(2)
		expect(helper(objArray, "foo")).toStrictEqual([ obj1, obj3 ])
	})
	it("can prune duplicates based on deep identity", () => {
		const obj1 = {
			"foo": {
				"bar": {
					"baz": 2
				}
			}
		}
		const obj2 = {
			"foo": {
				"bar": {
					"baz": 2
				}
			}
		}
		const obj3 = {
			"foo": {
				"bar": {
					"baz": 1
				}
			}
		}
		const objArray = [ obj1, obj2, obj3 ]

		expect(helper(objArray, "foo.bar.baz")).toHaveLength(2)
		expect(helper(objArray, "foo.bar.baz")).toStrictEqual([ obj1, obj3 ])
	})
})
