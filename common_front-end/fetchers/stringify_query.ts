import { stringify } from "qs"

import type { GeneralObject } from "$/types/general"
import isPlainObject from "$/type_guards/is_object"

export default function(query: object): string {
	return stringify(compileArrays(query))
}

function compileArrays(query: GeneralObject): GeneralObject {
	const semiSerializedObject: GeneralObject = {}

	for (const field in query) {
		if (Object.prototype.hasOwnProperty.call(query, field)) {
			const value = query[field]

			if (isPlainObject(value)) {
				semiSerializedObject[field] = compileArrays(value)
			} else if (Array.isArray(value)) {
				semiSerializedObject[field] = value.join(",")
			} else {
				semiSerializedObject[field] = value
			}
		}
	}
	return semiSerializedObject
}
