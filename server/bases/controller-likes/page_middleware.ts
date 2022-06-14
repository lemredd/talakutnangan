import { PageRequest } from "!/types/hybrid"
import { Serializable } from "%/types/independent"
import { Request, Response, NextFunction } from "!/types/dependent"

import Validation from "!/bases/validation"
import ControllerLike from "!/bases/controller-like"

/**
 * Base class for helpers to page route.
 *
 * This is intended to set up the passing of data to client.
 */
export default abstract class extends ControllerLike {
	getClientPayload(request: Request): Serializable { return {} }

	get endHandler(): null { return null }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async intermediate(
		request: PageRequest,
		_response: Response,
		next: NextFunction
	): Promise<void> {
		// TODO: Pre-serialize the user data
		request.clientPayload = {
			userProfile: request.isAuthenticated() ? <any><unknown>request.user : null,
			...this.getClientPayload(request)
		}
		next()
	}
}
