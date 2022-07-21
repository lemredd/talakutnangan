import Fetcher from "$@/communicators/fetcher"
import UserFetcher from "$@/communicators/user"
import DepartmentFetcher from "$@/communicators/department"

beforeEach(() => {
	Fetcher.initialize("/api")
	UserFetcher.initialize("/api")
	DepartmentFetcher.initialize("/api")
})
