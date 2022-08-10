import Fetcher from "$@/fetchers/fetcher"
import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"

beforeEach(() => {
	Fetcher.initialize("/api")
	UserFetcher.initialize("/api")
	RoleFetcher.initialize("/api")
	DepartmentFetcher.initialize("/api")
})
