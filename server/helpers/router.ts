import { Router as createRouter } from "express"
import Middleware from "!/helpers/middleware"
import Controller from "!/helpers/controller"
import RequestEnvironment from "!/helpers/request_environment";

export default abstract class Router {
	protected environment: RequestEnvironment = RequestEnvironment.current
	private prefixedRouter = createRouter()
	private overridenRouter = createRouter()
	private prefix: string

	constructor(prefix: string) {
		this.prefix = prefix
	}

	useController(controller: Controller): void {
		const { method, URL, handlers } = controller.generateRoute(this.prefix)
		if (URL.startsWith(this.prefix)) {
			this.prefixedRouter[method](URL, ...handlers)
		} else {
			this.overridenRouter[method](URL, ...handlers)
		}
	}

	useMiddleware(overridenURL: string, middleware: Middleware): void {
		const handlers = middleware.generateHandlers()
		this.overridenRouter.use(overridenURL, ...handlers)
	}

	get routers() {
		return {
			prefixedRouter: this.prefixedRouter,
			overridenRouter: this.overridenRouter
		}
	}

	useRouter(router: Router): void {
		const { prefixedRouter, overridenRouter } = (router.routers)
		this.prefixedRouter.use(prefixedRouter)
		this.overridenRouter.use(overridenRouter)
	}
}
