import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import buffer from "!/validators/base/buffer"
import nullable from "!/validators/base/nullable"

import MultipartController from "!/controllers/multipart"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return {
			"importedCSV": {
				"constraints": {
					"buffer": {
						"allowedMimeTypes": [ "text/csv" ],
						// 10 MB
						"maximumSize": 10_000_000,
						"minimumSize": 0
					}
				},
				"pipes": [ nullable, buffer ]
			},
			"nestedImportedCSV": {
				"constraints": {
					"object": {
						"file": {
							"constraints": {
								"buffer": {
									"allowedMimeTypes": [ "text/csv" ],
									// 10 MB
									"maximumSize": 10_000_000,
									"minimumSize": 0
								}
							},
							"pipes": [ buffer ]
						}
					}
				},
				"pipes": [ nullable, object ]
			},
			"roles": {
				"constraints": {
					"array": {
						"pipes": [ nullable ]
					},
					"nullable": { "defaultValue": [] }
				},
				"pipes": [ nullable, array ]
			}
		}
	}

	handle(request: Request, response: Response): Promise<void> {
		const info: { [key:string]: string } = {}
		const { body } = request

		for (const field in body) {
			if (Object.hasOwn(body, field)) {
				const value = body[field]
				info[field] = value
			}
		}

		response.status(this.status.OK).json(info)
		return Promise.resolve()
	}
}
