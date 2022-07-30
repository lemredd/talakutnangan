import type { GeneralObject } from "$/types/server"

export default class {
	private static cache: Map<Symbol, GeneralObject>

	static initialize() {
		this.cache = new Map()
	}

	static getCache(lclientKey: Symbol): GeneralObject|null {
		return this.cache
	}
}
