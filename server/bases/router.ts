import { UsableRoute } from "!/types/hybrid"
import { RouteInformation } from "$/types/server"

import ControllerLike from "!/bases/controller-like"
import RequestEnvironment from "$/singletons/request_environment"

export default abstract class Router extends RequestEnvironment {
	private asyncRegistrations: Promise<void>[] = []
	private routes: UsableRoute[] = []

	useControllersAsync(promise: Promise<ControllerLike[]>): void {
		const asyncRegistration = promise.then(controllers => this.useControllers(controllers))
		this.asyncRegistrations.push(asyncRegistration)
	}

	useControllers(controllers: ControllerLike[]): void {
		controllers.forEach(controller => this.useController(controller))
	}

	useRoutersAsync(promise: Promise<Router[]>): void {
		const asyncRegistration = promise.then(routers => this.useRouters(routers))
		this.asyncRegistrations.push(asyncRegistration)
	}

	useRouters(routers: Router[]): void {
		routers.forEach(router => this.useRouter(router))
	}

	useController(controller: ControllerLike): void {
		const information = controller.routeInformation
		const { handlers } = controller
		this.routes.push({
			handlers,
			information
		})
	}

	useRouter(router: Router): void {
		const asyncRegistration = router.allUsableRoutes.then(allUsableRoutes => {
			this.routes.push(...allUsableRoutes)
		})
		this.asyncRegistrations.push(asyncRegistration)
	}

	get allRouteInformation(): Promise<RouteInformation[]> {
		const allRouteInformation: RouteInformation[] = []

		return this.allUsableRoutes.then(routes => {
			for (const { information } of routes) {
				allRouteInformation.push(information)
			}

			return allRouteInformation
		})
	}

	get allUsableRoutes(): Promise<UsableRoute[]> {
		return Promise.all(this.asyncRegistrations).then(() => {
			this.asyncRegistrations = []
			return [ ...this.routes ]
		})
	}
}
