import Fetcher from "$@/communicators/fetcher"
import UserFetcher from "$@/communicators/user"

beforeEach(() => {
	Fetcher.initialize("/api")
	UserFetcher.initialize("/api")
})
