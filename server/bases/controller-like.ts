import { RouteInformation, OptionalMiddleware } from "!/types/independent"
import { RouteHandlers, EndHandler } from "!/types/hybrid"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Middleware from "!/bases/middleware"
import extractRouteInfo from "!/helpers/extract_route_info"

export default abstract class extends Middleware {
	/**
	 * Returns the path of the controller-like class. It should return `__filename`
	 */
	abstract get filePath(): string

	/**
	 * Returns the end handler of the controller-like class.
	 */
	abstract get endHandler(): EndHandler | null

	/**
	 * Returns the policy to be followed by the controller-like class.
	 */
	abstract get policy(): Policy | null

	/**
	 * Returns the body parser to be run after authorization by the controller-like class.
	 */
	abstract get bodyParser(): OptionalMiddleware

	/**
	 * Returns the validations to be run after body parsing by the controller-like class.
	 */
	abstract get validations(): Validation[]

	/**
	 * Returns the middlewares to be used before that main handler will execute.
	 */
	protected get middlewares(): Middleware[] {
		return []
	}

	/**
	 * Returns the jobs to run after the main handler executed.
	 */
	protected get postJobs(): Middleware[] {
		return []
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
			controller: this.intermediate.bind(this),
			postJobs: this.postJobs,
			endHandler: this.endHandler
		}
	}
}
