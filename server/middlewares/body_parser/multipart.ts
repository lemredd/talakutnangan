import { Buffer } from "buffer"
import busboy from "busboy"
import Middleware from "!/bases/middleware"
import type { Request, Response, NextFunction } from "!/types/dependent"

/**
 * Used to parse the forms that have attached files.
 */
export default class FormBodyParser extends Middleware {
	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		const newBody: { [key: string]: any } = {}
		const parser = busboy({ headers: request.headers })

		parser.on("file", (name, stream, info) => {
			let rawBuffer: number[] = []
			stream.on("data", data => {
				rawBuffer.push(...data)
			})
			.on("close", () => {
				newBody[name] = { buffer: Buffer.from(rawBuffer), info }
			})
		})

		parser.on("field", (name, value, _info) => {
			newBody[name] = value
		});

		parser.on("close", () => {
			request.body = newBody

			next()
		})

		request.pipe(parser)
	}
}
