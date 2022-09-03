import type { GeneralObject } from "$/types/general"
import Log from "$!/singletons/log"
import CacheClient from "$!/helpers/cache_client"

/**
 * Manager class that handles the cache of all requests.
 */
export default class {
	private static cache: Map<symbol, GeneralObject>

	static initialize() {
		this.cache = new Map()
	}

	static destroy() {
		this.cache.clear()
	}

	static initializeClient(): CacheClient {
		const clientKey = Symbol("cache client key")
		this.cache.set(clientKey, {})

		Log.success("cache", "initialized cache client")

		return new CacheClient(clientKey)
	}

	static destroyClient(clientKey: symbol): void {
		this.cache.delete(clientKey)

		Log.success("cache", "destroyed cache client")
	}

	static getCache(clientKey: symbol): GeneralObject {
		return this.cache.get(clientKey) || {}
	}

	static setCache(clientKey: symbol, newCache: GeneralObject): void {
		if (this.cache.get(clientKey)) {
			this.cache.set(clientKey, newCache)
		}
	}

	/**
	 * Used for testing purposes.
	 *
	 * The value should not be seen the client side.
	 */
	static get clientCount(): number {
		return this.cache.size
	}
}
