import { Buffer } from "buffer"
import { parse } from "csv-parse"

import type { Request, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import Middleware from "!/bases/middleware"
import convertToCamelCase from "$/helpers/convert_to_camel_case"

/**
 * Used to parse CSV files attached.
 *
 * Assumes request's body was parsed buy `Multipart` middleware.
 */
export default class CSVParser extends Middleware {
	private parser = parse({
		columns: headers => headers.map((header: string) => convertToCamelCase(header)),
		bom: true
	})

	private rawFields: string[]

	constructor(...rawFields: string[]) {
		super()
		this.rawFields = rawFields
	}

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		for (const field of this.rawFields) {
			// TODO: Throw error if the field does not exists or does not match validation
			const buffer: Buffer = request.body[field].buffer

			request.body[field] = await new Promise<{ [key:string]: string }[]>((resolve, reject) => {
				const rows: { [key:string]: string }[] = []
				const reader = () => {
					Log.trace("middleware", `reading the rows in the CSV file in "${field}" field`)
					let row;
					while((row = this.parser.read()) !== null) {
						rows.push(row)
					}
				}
				const thrower = (error: Error) => {
					Log.errorMessage(
						"middleware",
						`encountered error in processing CSV file  in "${field}" field`
					)
					unlisten()
					reject(error)
				}
				const closer = () => {
					Log.trace(
						"middleware",
						`resolving the read rows in the CSV file io "${field}" field`
					)
					unlisten()
					resolve(rows)
				}
				const unlisten = () => {
					this.parser.off("readable", reader)
					this.parser.off("error", thrower)
					this.parser.off("end", closer)
				}
				this.parser.on("readable", reader)
				this.parser.on("error", thrower)
				this.parser.on("end", closer)
				this.parser.write(buffer)
				this.parser.end()
			}).catch(next)

			Log.success("middleware", `parsed the CSV file in "${field}" field`)
		}

		next()
	}
}
