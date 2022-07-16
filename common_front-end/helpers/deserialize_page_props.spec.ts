import deserializePageProps from "./deserialize_page_props"

describe("Helper: Deserialize page props", () => {
	it("should deserialize authenticated page context", async () => {
		const userProfile = {
			data: {
				type: "user",
				id: 1,
				attributes: {
					name: "A"
				},
				relationships: {
					role: {
						data: [
							{
								type: "role",
								id: 2
							}
						]
					}
				}
			},
			included: [
				{
					type: "role",
					id: 2,
					attributes: {
						name: "B"
					}
				}
			]
		}
		const serializedObject = {
			pageProps: {
				userProfile
			}
		}

		const deserializedObject = deserializePageProps(serializedObject)

		expect(deserializedObject).toStrictEqual({
			pageProps: {
				userProfile: {
					data: {
						type: "user",
						id: 1,
						name: "A",
						role: {
							data: [
								{
									type: "role",
									id: 2,
									name: "B"
								}
							]
						}
					}
				}
			}
		})
	})

	it("should not deserialize unauthenticated page context", async () => {
		const serializedObject = {
			pageProps: {
				userProfile: null
			}
		}

		const deserializedObject = deserializePageProps(serializedObject)

		expect(deserializedObject).toStrictEqual({
			pageProps: {
				userProfile: null
			}
		})
	})
})
