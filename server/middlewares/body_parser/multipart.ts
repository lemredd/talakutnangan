import { Buffer } from "buffer"
import busboy from "busboy"
import { parse } from "qs"
import Middleware from "!/bases/middleware"
import type { Request, Response, NextFunction } from "!/types/dependent"

/**
 * Used to parse the forms that have attached files.
 */
export default class FormBodyParser extends Middleware {
	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		const bufferedFiles: { [key: string]: any } = {}
		const formQueries: string[] = []
		const parser = busboy({ headers: request.headers })

		parser.on("file", (name, stream, info) => {
			let rawBuffer: number[] = []
			stream.on("data", data => {
				rawBuffer.push(...data)
			})
			.on("close", () => {
				bufferedFiles[name] = { buffer: Buffer.from(rawBuffer), info }
			})
		})

		parser.on("field", (name, value, _info) => {
			formQueries.push(`${name}=${value}`)
		});

		parser.on("close", () => {
			const parsedFormQuery = parse(formQueries.join("&"))
			request.body = {
				...bufferedFiles,
				...parsedFormQuery
			}

			next()
		})

		request.pipe(parser)
	}
}
