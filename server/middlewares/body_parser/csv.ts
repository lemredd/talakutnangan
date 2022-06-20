import { Buffer } from "buffer"
import busboy from "busboy"

import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import MultipartMiddleware from "!/middlewares/body_parser/multipart"

/**
 * Used to parse CSV files attached.
 */
export default class CSVParser extends Middleware {
	private rawFields: string[]

	constructor(...rawFields: string[]) {
		super()
		this.rawFields = rawFields
	}

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		for (const field of this.rawFields) {
			const buffer: Buffer = request.body[field]
		}
	}
}
