import deserialize from "./deserialize"

describe("Helper: Deserialize", () => {
	it("should deserialize object with relationship", () => {
		const CURRENT_TIME = new Date()
		const serializedObject = {
			"data": {
				"attributes": {
					"createdAt": CURRENT_TIME.toISOString(),
					"name": "A"
				},
				"id": 1,
				"relationships": {
					"role": {
						"data": [
							{
								"id": 2,
								"type": "role"
							}
						]
					}
				},
				"type": "user"
			},
			"included": [
				{
					"attributes": {
						"name": "B"
					},
					"id": 2,
					"type": "role"
				}
			]
		}

		const deserializedObject = deserialize(serializedObject)

		expect(deserializedObject).toStrictEqual({
			"data": {
				"createdAt": CURRENT_TIME,
				"id": 1,
				"name": "A",
				"role": {
					"data": [
						{
							"id": 2,
							"name": "B",
							"type": "role"
						}
					]
				},
				"type": "user"
			}
		})
	})

	it("should not deserialize null", () => {
		const serializedObject = null

		const deserializedObject = deserialize(serializedObject)

		expect(deserializedObject).toBeNull()
	})
})
