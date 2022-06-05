import Middleware from "!/bases/middleware"
import { RouteInformation } from "!/types/independent"
import extractRouteInfo from "!/helpers/extract_route_info"
import { Request, Response, NextFunction, RequestHandler } from "!/types/dependent"

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

	intermediate(request: Request, response: Response, next: NextFunction): void {
		this.handle(request, response).then(next)
	}

	get description(): string|null { return null }

	get routeInformation(): RouteInformation {
		return <RouteInformation>{
			...extractRouteInfo(this.filePath),
			description: this.description
		}
	}

	get handlers(): RequestHandler[] {
		const middlewares = this.middlewares
		const postJobs = this.postJobs

		if (postJobs.length === 0) {
			return [
				...middlewares,
				this.handle.bind(this)
			]
		} else {
			return [
				...middlewares,
				this.intermediate.bind(this),
				...postJobs
			]
		}
	}
}
