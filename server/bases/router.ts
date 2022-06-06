import Middleware from "!/bases/middleware"
import Controller from "!/bases/controller"
import RequestEnvironment from "!/helpers/request_environment";

import { UsableRoute } from "!/types/hybrid";
import { RouteInformation } from "!/types/independent";

export default abstract class Router extends RequestEnvironment {
	private routes: UsableRoute[] = []

	useControllers(controllers: Controller[]): void {
		controllers.forEach(controller => this.useController(controller))
	}

	useRouters(routers: Router[]): void {
		routers.forEach(router => this.useRouter(router))
	}

	useController(controller: Controller): void {
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
