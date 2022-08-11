import deserialize from "./deserialize"

describe("Helper: Deserialize", () => {
	it("should deserialize object with relationship", async() => {
		const serializedObject = {
			"data": {
				"type": "user",
				"id": 1,
				"attributes": {
					"name": "A"
				},
				"relationships": {
					"role": {
						"data": [
							{
								"type": "role",
								"id": 2
							}
						]
					}
				}
			},
			"included": [
				{
					"type": "role",
					"id": 2,
					"attributes": {
						"name": "B"
					}
				}
			]
		}

		const deserializedObject = deserialize(serializedObject)

		expect(deserializedObject).toStrictEqual({
			"data": {
				"type": "user",
				"id": 1,
				"name": "A",
				"role": {
					"data": [
						{
							"type": "role",
							"id": 2,
							"name": "B"
						}
					]
				}
			}
		})
	})

	it("should not deserialize null", async() => {
		const serializedObject = null

		const deserializedObject = deserialize(serializedObject)

		expect(deserializedObject).toBeNull()
	})
})
