import { parse } from "qs"
import busboy from "busboy"
import { Buffer } from "buffer"

import type { Request, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import mergeDeeply from "$!/helpers/merge_deeply"
import RequestFilter from "!/bases/request_filter"
import setDeepPath from "$!/helpers/set_deep_path"

/**
 * Used to parse the forms that have attached files.
 */
export default class FormBodyParser extends RequestFilter {
	parse(request: Request, next: NextFunction): Promise<void> {
		Log.trace("middleware", "entered multipart body parser")
		const bufferedFiles: { [key: string]: any } = {}
		const formQueries: string[] = []
		const parser = busboy({ "headers": request.headers })

		parser.on("file", (name, stream, info) => {
			const rawBuffer: number[] = []
			stream.on("data", data => {
				rawBuffer.push(...data)
			})
			.on("close", () => {
				setDeepPath(bufferedFiles, name, {
					"buffer": Buffer.from(rawBuffer),
					info
				})
				Log.trace("middleware", `parsed "${name}" file data in multipart body parser`)
			})
		})

		parser.on("field", (name, value, unusedInfo) => {
			formQueries.push(`${name}=${value}`)
			Log.trace("middleware", `prepared "${name}" field in multipart body parser`)
		})

		parser.on("close", () => {
			const parsedFormQuery = parse(formQueries.join("&"))
			Log.trace("middleware", "parsed fields in multipart body parser")

			request.body = mergeDeeply(parsedFormQuery, bufferedFiles)

			Log.success("middleware", "merged fields and files as one body in multipart body parser")

			Log.trace("middleware", "exiting multipart body parser")
			next()
		})

		Log.success("middleware", "attached parser listeners in multipart body parser")

		request.pipe(parser)

		Log.success("middleware", "piped request body to parser in multipart body parser")

		return Promise.resolve()
	}

	async filterRequest(request: Request): Promise<void> {
		await this.runFilter(
			(passedRequest: Request, unusedResponse: Response, next: NextFunction) => {
				this.parse(passedRequest, next)
			},
			request
		)
	}
}
