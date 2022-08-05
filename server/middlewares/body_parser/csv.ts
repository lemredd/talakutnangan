import { parse } from "csv-parse"

import type { GeneralObject } from "$/types/general"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import BaseError from "$!/errors/base"
import ParserError from "$!/errors/parser"
import Middleware from "!/bases/middleware"
import setDeepPath from "$!/helpers/set_deep_path"
import accessDeepPath from "$!/helpers/access_deep_path"
import convertToCamelCase from "$/helpers/convert_to_camel_case"

/**
 * Used to parse CSV files attached.
 *
 * Assumes request's body was parsed buy `Multipart` middleware.
 * Assumes the fields to be converted exists.
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
		try {
			for (const field of this.rawFields) {
				const buffer: Buffer = accessDeepPath(request.body, `${field}.buffer`)

				setDeepPath(request.body, field, await new Promise<GeneralObject<string>[]>(
					(resolve, reject) => {
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
							Log.error("middleware", error)

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
					}
				))

				Log.success("middleware", `parsed the CSV file in "${field}" field`)
			}

			next()
		} catch(error) {
			if (error instanceof BaseError) {
				next(error)
			} else if (error instanceof Error) {
				next(new ParserError(error.message))
			} else {
				next(error)
			}
		}
	}
}
