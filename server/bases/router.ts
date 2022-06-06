import Middleware from "!/bases/middleware"
import Controller from "!/bases/controller"
import RequestEnvironment from "!/helpers/request_environment";

import { UsableRoute } from "!/types/hybrid";
import { RouteInformation } from "!/types/independent";

export default abstract class Router extends RequestEnvironment {
	private routes: UsableRoute[] = []
	private subrouters: Router[] = []

	useControllers(controllers: Controller[]): void {
		controllers.forEach(controller => this.useController(controller))
	}

	useRouters(routers: Router[]): void {
		this.subrouters.push(...routers)
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
		this.subrouters.push(router)
	}

	get allRouteInformation(): RouteInformation[] {
		const allRouteInformation: RouteInformation[] = []

		for (const { information } of this.routes) {
			allRouteInformation.push(information)
		}

		for (const subrouter of this.subrouters) {
			const allSubrouteInformation = subrouter.allRouteInformation
			allRouteInformation.push(...allSubrouteInformation)
		}

		return allRouteInformation
	}

	get allUsableRoutes(): UsableRoute[] {
		const allUsableRoutes: UsableRoute[] = []

		for (const processor of this.routes) {
			allUsableRoutes.push(processor)
		}

		for (const subrouter of this.subrouters) {
			const allUsableSubroutes = subrouter.allUsableRoutes
			allUsableRoutes.push(...allUsableSubroutes)
		}

		return allUsableRoutes
	}
}
