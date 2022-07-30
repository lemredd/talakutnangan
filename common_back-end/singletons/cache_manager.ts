import type { GeneralObject } from "$/types/server"
import CacheClient from "$!/helpers/cache_client"

export default class {
	private static cache: Map<Symbol, GeneralObject>

	static initialize() {
		this.cache = new Map()
	}

	static makeClient(): CacheClient {
		const clientKey = Symbol("cache client key")
		this.cache.set(clientKey, {})
		return new CacheClient(clientKey)
	}

	static destroyClient(clientKey: Symbol): void {
		this.cache.delete(clientKey)
	}

	static getCache(clientKey: Symbol): GeneralObject {
		return this.cache.get(clientKey) || {}
	}

	static setCache(clientKey: Symbol, newCache: GeneralObject): void {
		if (this.cache.get(clientKey)) {
			this.cache.set(clientKey, newCache)
		}
	}
}
