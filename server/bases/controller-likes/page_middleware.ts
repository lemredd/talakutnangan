import { Request, Response, NextFunction } from "!/types/dependent"

import Validation from "!/bases/validation"
import ControllerLike from "!/bases/controller-like"

/**
 * Base class for helpers to page route.
 *
 * This is intended to set up the passing of data to client.
 */
export default abstract class extends ControllerLike {
	get endHandler(): null { return null }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// TODO: Pass the details to be used by client
		next()
	}
}
