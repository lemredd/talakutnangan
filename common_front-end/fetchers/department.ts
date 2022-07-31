import type { DepartmentAttributes } from "$/types/documents/department"
import Fetcher from "$@/fetchers/fetcher"

export default class extends Fetcher<DepartmentAttributes> {
	static initialize(basePath: string) {
		super.initialize(basePath, "department")
	}
}
