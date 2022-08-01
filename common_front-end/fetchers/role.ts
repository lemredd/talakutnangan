import type { RoleAttributes } from "$/types/documents/role"
import Fetcher from "$@/fetchers/fetcher"

export default class RoleFetcher extends Fetcher<RoleAttributes> {
	static initialize(basePath: string) {
		super.initialize(basePath, "role")
	}

	constructor() {
		super(RoleFetcher.basePath, RoleFetcher.type)
	}
}
