import { parse } from "csv-parse"

import type { Request } from "!/types/dependent"
import type { GeneralObject } from "$/types/general"

import Log from "$!/singletons/log"
import BaseError from "$!/errors/base"
import ParserError from "$!/errors/parser"
import RequestFilter from "!/bases/request_filter"
import setDeepPath from "$!/helpers/set_deep_path"
import convertToCamel from "$/string/convert_to_camel"
import accessDeepPath from "$!/helpers/access_deep_path"

/**
 * Used to parse CSV files attached.
 *
 * Assumes request's body was parsed buy `Multipart` middleware.
 * Assumes the fields to be converted exists.
 */
export default class CSVParser extends RequestFilter {
	private rawFields: string[]

	constructor(...rawFields: string[]) {
		super()
		this.rawFields = rawFields
	}

	async filterRequest(request: Request): Promise<void> {
		const promisedFields: Promise<{ field: string, value: any }>[] = []

		try {
			for (const field of this.rawFields) {
				const parser = parse({
					"bom": true,
					"columns": headers => headers.map((header: string) => convertToCamel(header))
				})

				const buffer: Buffer = accessDeepPath(request.body, `${field}.buffer`)

				const promise = new Promise<GeneralObject<string>[]>((resolve, reject) => {
					const rows: { [key:string]: string }[] = []
					const reader = () => {
						Log.trace("middleware", `reading the rows in the CSV file in "${field}" field`)
						let row = null
						while ((row = parser.read()) !== null) {
							rows.push(row)
						}
					}
					const thrower = (error: Error) => {
						Log.errorMessage(
							"middleware",
							`encountered error in processing CSV file  in "${field}" field`
						)
						Log.error("middleware", error)

						// eslint-disable-next-line no-use-before-define
						unlisten()
						reject(error)
					}
					const closer = () => {
						Log.trace(
							"middleware",
							`resolving the read rows in the CSV file io "${field}" field`
						)
						// eslint-disable-next-line no-use-before-define
						unlisten()
						resolve(rows)
					}
					const unlisten = () => {
						parser.off("readable", reader)
						parser.off("error", thrower)
						parser.off("end", closer)
					}
					parser.on("readable", reader)
					parser.on("error", thrower)
					parser.on("end", closer)
					parser.write(buffer)
					parser.end()
				}).then(value => ({
					field,
					value
				}))

				promisedFields.push(promise)
				Log.success("middleware", `parsed the CSV file in "${field}" field`)
			}

			(await Promise.all(promisedFields)).forEach(info => {
				const { field, value } = info
				setDeepPath(request.body, field, value)
			})
		} catch (error) {
			if (error instanceof BaseError) {
				throw error
			} else if (error instanceof Error) {
				throw new ParserError(error.message)
			} else {
				throw error
			}
		}
	}
}
