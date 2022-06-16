import RequestEnvironment from "$/helpers/request_environment"
import { Request, Response, NextFunction } from "!/types/dependent"

/**
 * Base middleware that is being used to organize the routing information of routes
 */
export default abstract class extends RequestEnvironment {
	abstract intermediate(request: Request, response: Response, next: NextFunction): Promise<void>
}
