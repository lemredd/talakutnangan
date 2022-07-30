import CacheManager from "$!/singletons/cache_manager"

beforeEach(() => {
	CacheManager.initialize()
})

afterEach(() => {
	CacheManager.destroy()
})
