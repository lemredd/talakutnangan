import type { RouteInformation } from "$/types/server"
import type { OptionalMiddleware } from "!/types/independent"
import type { RouteHandlers, EndHandler } from "!/types/hybrid"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Middleware from "!/bases/middleware"
import extractRouteInfo from "!/helpers/extract_route_info"

/**
 * Base class for all controllers.
 *
 * Uses policy, body parser, and validation as initial middlewares.
 */
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
	 * Lists middlewares to run after authorizing the current user.
	 */
	get postPolicyMiddlewares(): OptionalMiddleware[] { return [] }

	/**
	 * Lists middlewares to run after body parsing is done.
	 */
	get postParseMiddlewares(): OptionalMiddleware[] { return [] }

	/**
	 * Lists middlewares to run after validation.
	 */
	get postValidationMiddlewares(): OptionalMiddleware[] { return [] }

	/**
	 * Returns the middlewares to be used before that main handler will execute.
	 */
	get middlewares(): OptionalMiddleware[] {
		return [
			this.policy,
			...this.postPolicyMiddlewares,
			this.bodyParser,
			...this.postParseMiddlewares,
			...this.validations,
			...this.postValidationMiddlewares
		]
	}

	/**
	 * Returns the jobs to run after the main handler executed.
	 */
	get postJobs(): OptionalMiddleware[] {
		return []
	}

	get description(): string|null { return null }

	get routeInformation(): RouteInformation {
		return <RouteInformation>{
			...extractRouteInfo(this.filePath),
			"description": this.description
		}
	}

	get handlers(): RouteHandlers {
		return {
			"controller": this.intermediate.bind(this),
			"endHandler": this.endHandler,
			"middlewares": this.middlewares,
			"postJobs": this.postJobs
		}
	}
}
