import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Validation from "!/bases/validation"
import object from "!/validators/base/object"
import same from "!/validators/comparison/same"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"

export default class extends Validation {
	constructor() {
		super((request: Request): FieldRules => ({
			params: {
				pipes: [ required, object ],
				constraints: {
					object: {
						id: {
							pipes: [ required, integer ],
							constraints: {}
						}
					}
				}
			},
			body: {
				pipes: [ required, object ],
				constraints: {
					object: {
						data: {
							pipes: [ required, object ],
							constraints: {
								object: {
									id: {
										pipes: [ required, integer, same ],
										constraints: {
											same: {
												pointer: "params.id"
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}))
	}

	getSubject(request: Request): object {
		return {
			params: request.params,
			body: request.body
		}
	}
}