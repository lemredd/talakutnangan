import { Request, Response, router as createRouter } from "express"
import Middleware from "!/helpers/middleware"
import Controller from "!/helpers/controller"
import RequestEnvironment from "!/helpers/request_environment";

export default abstract class Router {
	protected const environment: RequestEnvironment = RequestEnvironment.current
	private const prefixedRouter = createRouter()
	private const overridenRouter = createRouter()
	private const prefix: string

	constructor(prefix: string) {
		this.prefix = prefix
	}

	use(controller: Controller) {
		const { method, URL, handlers } = controller.generateRoute(this.prefix)

		if (URL.startsWith(this.prefix)) {
			this.prefixedRouter[method](URL, ...handlers)
		} else {
			this.overridenRouter[method](URL, ...handlers)
		}
	}

	use(overridenURL: string, middleware: Middleware) {
		const { URL, handlers } = middleware.generateRoute(overridenURL)
		this.overridenRouter.use(URL, ...handlers)
	}

	get routers() {
		return {
			prefixedRouter: this.prefixedRouter,
			overridenRouter: this.overridenRouter
		}
	}

	use(router: Router) {
		const { prefixedRouter, overridenRouter } = router.routers()
		this.prefixedRouter.use(prefixedRouter)
		this.overridenRouter.use(overridenRouter)
	}
}
