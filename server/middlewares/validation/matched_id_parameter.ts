import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Validation from "!/bases/validation"
import object from "!/app/validators/base/object"
import integer from "!/app/validators/base/integer"
import required from "!/app/validators/base/required"
import same from "!/app/validators/comparison/same"

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
											// TODO: Make this into object and used the referenced value
											same: {
												value: "params.id"
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
		return request
	}
}
