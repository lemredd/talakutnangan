import Middleware from "!/bases/middleware"
import CacheDestroyer from "!/middlewares/miscellaneous/cache_destroyer"

// eslint-disable-next-line require-await
export default async function(): Promise<Middleware[]> {
	return [
		new CacheDestroyer()
	]
}
