import busboy from "busboy"
import Middleware from "!/bases/middleware"
import type { Request, Response, NextFunction } from "!/types/dependent"

/**
 * Used to parse the forms that have attached files.
 */
export default class FormBodyParser extends Middleware {
	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		const newBody = {}
		const parser = busboy({ headers: request.headers })

		parser.on("file", (name, stream, info) => {
			stream.on("data", data => {
				newBody[name] = { stream, info }
			})
		})

		parser.on("field", (name, value, _info) => {
			newBody[name] = value
		});

		parser.on("close", () => {
			request.body = newBody

			next()
		})
	}
}
