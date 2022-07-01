import { UnitError } from "$/types/server"
import { Request, Response, NextFunction } from "!/types/dependent"

import Log from "!/helpers/log"
import BaseError from "$!/errors/base"
import RequestEnvironment from "!/helpers/request_environment"

/**
 * Catches all errors on every route for unified error handling.
 * @param error Error thrown in previous middlewares or controllers.
 * @param request Request of the client.
 * @param response Response given to the client.
 * @param next Function to call other middlewares or error handlers.
 */
export default function(error: Error, request: Request, response: Response, next: NextFunction) {
	if (response.writableEnded || response.headersSent) {
		Log.errorMessage("middleware", `Cannot write the error at "${request.path}"`)
	} else {
		if (request.accepts("text/html")) {
			// TODO: Redirect to error page
			response.status(RequestEnvironment.status.INTERNAL_SERVER_ERROR).end()
		} else if (request.accepts("application/vnd.api+json")) {
			let unitError: UnitError = {
				status: RequestEnvironment.status.INTERNAL_SERVER_ERROR,
				code: "-1",
				title: "Unknown",
				detail: error.message
			}

			if (error instanceof BaseError) {
				unitError = error.toJSON()
			}

			response.status(unitError.status)
			response.json({
				errors: [ unitError ]
			})
			Log.errorMessage("middleware", `${unitError.title}: ${unitError.detail}`)
		} else {
			response.status(RequestEnvironment.status.NOT_ACCEPTABLE)

			const message = "Error message could not be accepted by the client"
			response.send(message)
			Log.errorMessage("middleware", message)
		}

		response.end()
	}
}
