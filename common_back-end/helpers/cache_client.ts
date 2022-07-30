import CacheManager from "$!/singletons/cache_manager"
import accessDeepPath from "$!/helpers/access_deep_path"

export default class {
	private clientKey: Symbol

	constructor(clientKey: Symbol) {
		this.clientKey = clientKey
	}

	getCache(path: string): any|null {
		return accessDeepPath(CacheManager.getCache(this.clientKey), path, null)
	}
}
