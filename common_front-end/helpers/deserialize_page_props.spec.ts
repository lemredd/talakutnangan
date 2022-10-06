import deserializePageProps from "./deserialize_page_props"

describe("Helper: Deserialize page props", () => {
	it("should deserialize authenticated page context", () => {
		const userProfile = {
			"data": {
				"attributes": {
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
		const serializedObject = {
			"pageProps": {
				userProfile
			}
		}

		const deserializedObject = deserializePageProps(serializedObject)

		expect(deserializedObject).toStrictEqual({
			"pageProps": {
				"userProfile": {
					"data": {
						"id": "1",
						"name": "A",
						"role": {
							"data": [
								{
									"id": "2",
									"name": "B",
									"type": "role"
								}
							]
						},
						"type": "user"
					}
				}
			}
		})
	})

	it("should not deserialize unauthenticated page context", () => {
		const serializedObject = {
			"pageProps": {
				"userProfile": null
			}
		}

		const deserializedObject = deserializePageProps(serializedObject)

		expect(deserializedObject).toStrictEqual({
			"pageProps": {
				"userProfile": null
			}
		})
	})
})
