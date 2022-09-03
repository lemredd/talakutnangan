import setDeepPath from "$!/helpers/set_deep_path"
import CacheManager from "$!/singletons/cache_manager"
import accessDeepPath from "$!/helpers/access_deep_path"

export default class {
	private clientKey: symbol

	constructor(clientKey: symbol) {
		this.clientKey = clientKey
	}

	destroy() {
		CacheManager.destroyClient(this.clientKey)
	}

	getCache(path: string): any|null {
		return accessDeepPath(CacheManager.getCache(this.clientKey), path, null)
	}

	setCache(path: string, value: any): void {
		const currentCache = this.getCache(path) ?? {}

		const newCache = setDeepPath(currentCache, path, value)

		CacheManager.setCache(this.clientKey, newCache)
	}
}
