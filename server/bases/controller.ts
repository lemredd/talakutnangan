import Middleware from "!/bases/middleware"
import extractRouteInfo from "!/helpers/extract_route_info"

import { RouteHandlers } from "!/types/hybrid"
import { RouteInformation } from "!/types/independent"
import { Request, Response, NextFunction } from "!/types/dependent"

export default abstract class extends Middleware {
	/**
	 * Returns the path of the controller. It should return `__filename`
	 */
	abstract get filePath(): string

	/**
	 * Handles the request mainly
	 */
	abstract handle(request: Request, response: Response): Promise<void>

	/**
	 * Returns the middlewares to be used before that main handle will execute.
	 */
	protected get middlewares(): Middleware[] {
		return []
	}

	/**
	 * Returns the jobs to run after the main handle executed.
	 */
	protected get postJobs(): Middleware[] {
		return []
	}

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		return this.handle(request, response).then(next)
	}

	get description(): string|null { return null }

	get routeInformation(): RouteInformation {
		return <RouteInformation>{
			...extractRouteInfo(this.filePath),
			description: this.description
		}
	}

	get handlers(): RouteHandlers {
		return {
			middlewares: this.middlewares,
			controllerAsMiddleware: this.intermediate.bind(this),
			controllerAsEnd: this.handle.bind(this),
			postJobs: this.postJobs
		}
	}
}
