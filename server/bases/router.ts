import { UsableRoute } from "!/types/hybrid"
import { RouteInformation } from "$/types/server"

import ControllerLike from "!/bases/controller-like"
import RequestEnvironment from "$/singletons/request_environment"

export default abstract class Router extends RequestEnvironment {
	private routes: UsableRoute[] = []

	useControllers(controllers: ControllerLike[]): void {
		controllers.forEach(controller => this.useController(controller))
	}

	useRouters(routers: Router[]): void {
		routers.forEach(router => this.useRouter(router))
	}

	useController(controller: ControllerLike): void {
		const information = controller.routeInformation
		const handlers = controller.handlers
		this.routes.push({
			information,
			handlers
		})
	}

	useRouter(router: Router): void {
		this.routes.push(...router.allUsableRoutes)
	}

	get allRouteInformation(): RouteInformation[] {
		const allRouteInformation: RouteInformation[] = []

		for (const { information } of this.routes) {
			allRouteInformation.push(information)
		}

		return allRouteInformation
	}

	get allUsableRoutes(): UsableRoute[] {
		return [ ...this.routes ]
	}
}
