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
	 * Returns the middlewares to be used before that handle will execute.
	 */
	protected getPremiddlewares(): Middleware[] {
		return []
	}

	/**
	 * Returns the middlewares to be used after the handle executed.
	 */
	protected getPostmiddlewares(): Middleware[] {
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

	get handler(): RequestHandler[] {
		const premiddlewares = this.getPremiddlewares()
		const postmiddlewares = this.getPostmiddlewares()

		if (postmiddlewares.length === 0) {
			return [
				...premiddlewares,
				this.handle.bind(this)
			]
		} else {
			return [
				...premiddlewares,
				this.intermediate.bind(this),
				...postmiddlewares
			]
		}
	}
}
