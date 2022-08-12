import BaseFetcher from "$@/fetchers/base"
import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"

beforeEach(() => {
	BaseFetcher.initialize("/api")
	UserFetcher.initialize("/api")
	RoleFetcher.initialize("/api")
	DepartmentFetcher.initialize("/api")
})
