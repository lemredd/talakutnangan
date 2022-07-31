import type { RoleAttributes } from "$/types/documents/role"
import Fetcher from "$@/fetchers/fetcher"

export default class extends Fetcher<RoleAttributes> {
	static initialize(basePath: string) {
		super.initialize(basePath, "role")
	}
}
