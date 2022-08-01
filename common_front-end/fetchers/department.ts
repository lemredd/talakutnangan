import type { DepartmentAttributes } from "$/types/documents/department"
import Fetcher from "$@/fetchers/fetcher"

export default class DepartmentFetcher extends Fetcher<DepartmentAttributes> {
	static initialize(basePath: string) {
		super.initialize(basePath, "department")
	}

	constructor() {
		super(DepartmentFetcher.basePath, DepartmentFetcher.type)
	}
}
