import { Router as createRouter } from "express"
import Middleware from "!/helpers/middleware"
import Controller from "!/helpers/controller"
import RequestEnvironment from "!/helpers/request_environment";

export default class Router extends RequestEnvironment {
	private prefixedRouter = createRouter()
	private overridenRouter = createRouter()
	private prefix: string

	constructor(prefix: string) {
		super()
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

	get routers(): createRouter[] {
		return [
			this.prefixedRouter,
			this.overridenRouter
		]
	}

	get combinedRouter(): createRouter {
		const main = createRouter()
		main.use(this.prefixedRouter)
		main.use(this.overridenRouter)
		return main
	}

	useRouter(router: Router): void {
		const [ prefixedRouter, overridenRouter ] = (router.routers)
		this.prefixedRouter.use(prefixedRouter)
		this.overridenRouter.use(overridenRouter)
	}
}
