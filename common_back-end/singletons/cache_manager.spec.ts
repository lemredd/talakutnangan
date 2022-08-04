import CacheManager from "./cache_manager"

describe("Back-end Singleton: Cache manager", () => {
	it("can set through cache client", () => {
		const client = CacheManager.initializeClient()

		client.setCache("hello.0.world", "foo")

		expect(CacheManager.clientCount).toEqual(1)
		expect(client.getCache("hello")).toStrictEqual([
			{ world: "foo" }
		])
	})

	it("can get and ignore unknown clients", () => {
		const symbol = Symbol("cache key")

		CacheManager.setCache(symbol, { a: { b: 4 } })

		expect(CacheManager.clientCount).toEqual(0)
		expect(CacheManager.getCache(symbol)).toStrictEqual({})
	})

	it("can increase client count", () => {
		CacheManager.initializeClient()
		CacheManager.initializeClient()

		const count = CacheManager.clientCount

		expect(count).toEqual(2)
	})
})
