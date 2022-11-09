import Middleware from "!/bases/middleware"
import Session from "!/middlewares/miscellaneous/session"
import Compression from "!/middlewares/miscellaneous/compression"
import AuthenticationSession from "!/middlewares/authentication/session"
import CacheInitializer from "!/middlewares/miscellaneous/cache_initializer"
import AuthenticationInitializer from "!/middlewares/authentication/initializer"

export default function(): Middleware[] {
	return [
		new Compression(),
		new CacheInitializer(),
		new Session(),
		new AuthenticationInitializer(),
		new AuthenticationSession()
	]
}
