import Log from "$!/singletons/log"
import URLMaker from "$!/singletons/url_maker"
import CacheManager from "$!/singletons/cache_manager"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

// eslint-disable-next-line require-await
export default async function() {
	CacheManager.initialize()

	Log.trace("app", "initialized cache manager")

	const protocol = process.env.WEB_PROTOCOL || "http"
	const hostname = process.env.WEB_HOST || "localhost"
	const port = parseInt(process.env.WEB_PORT || process.env.PORT || "80", 10)
	const basePath = process.env.WEB_BASE_PATH || "/"
	URLMaker.initialize(protocol, hostname, port, basePath)

	Log.trace("app", "initialized URL maker")

	CommonMiddlewareList.initialize()

	Log.trace("app", "initialized common middleware list")
}
