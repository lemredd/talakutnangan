import { Router as createRouter } from "express"
import Middleware from "!/bases/middleware"
import Controller from "!/bases/controller"
import RequestEnvironment from "!/helpers/request_environment";

export default abstract class Router extends RequestEnvironment {
	private prefixedRouter = createRouter()
	private overridenRouter = createRouter()

	abstract get prefix(): string;

	useControllers(controllers: Controller[]): void {
		controllers.forEach(controller => this.useController(controller))
	}

	useRouters(routers: Router[]): void {
		routers.forEach(router => this.useRouter(router))
	}

	useController(controller: Controller): void {
		const { method, URL, handlers } = controller.generateRoute(this.prefix)
		if (URL.startsWith(this.prefix)) {
			this.prefixedRouter[method](URL, ...handlers)
		} else {
			this.overridenRouter[method](URL, ...handlers)
		}
	}

	useRouter(router: Router): void {
		const [ prefixedRouter, overridenRouter ] = (router.routers)
		this.prefixedRouter.use(prefixedRouter)
		this.overridenRouter.use(overridenRouter)
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
}
