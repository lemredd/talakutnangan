import { Buffer } from "buffer"
import busboy from "busboy"
import { parse } from "qs"
import Log from "!/helpers/log"
import Middleware from "!/bases/middleware"
import type { Request, Response, NextFunction } from "!/types/dependent"

/**
 * Used to parse the forms that have attached files.
 */
export default class FormBodyParser extends Middleware {
	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		Log.trace("middleware", "entered multipart body parser")
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
				Log.trace("middleware", `parsed "${name}" file data in multipart body parser`)
			})
		})

		parser.on("field", (name, value, _info) => {
			formQueries.push(`${name}=${value}`)
			Log.trace("middleware", `prepared "${name}" field in multipart body parser`)
		});

		parser.on("close", () => {
			const parsedFormQuery = parse(formQueries.join("&"))
			Log.trace("middleware", "parsed fields in multipart body parser")

			request.body = {
				...bufferedFiles,
				...parsedFormQuery
			}

			Log.success("middleware", "merged fields and files as one body in multipart body parser")

			Log.trace("middleware", "exiting multipart body parser")
			next()
		})

		Log.success("middleware", "attached parser listeners in multipart body parser")

		request.pipe(parser)

		Log.success("middleware", "piped request body to parser in multipart body parser")
	}
}
