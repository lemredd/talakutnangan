import Fetcher from "$@/fetchers/fetcher"
import UserFetcher from "$@/fetchers/user"
import DepartmentFetcher from "$@/fetchers/department"

beforeEach(() => {
	Fetcher.initialize("/api")
	UserFetcher.initialize("/api")
	DepartmentFetcher.initialize("/api")
})
