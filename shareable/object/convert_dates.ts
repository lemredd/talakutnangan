import type { GeneralObject } from "$/types/general"
import isString from "$/type_guards/is_string"
import isPlainObject from "$/type_guards/is_plain_object"

/**
 * Converts the value of string with At to date.
 * @param value Object to convert
 */
export default function convertDates(value: GeneralObject): GeneralObject {
	const rawObject = value
	for (const property in value) {
		if (Object.hasOwn(value, property)) {
			if (property.endsWith("At")) {
				if (isString(rawObject[property])) {
					rawObject[property] = new Date(rawObject[property])
				}
			} else if (isPlainObject(rawObject[property])) {
				rawObject[property] = convertDates(rawObject[property])
			} else if (Array.isArray(rawObject[property])) {
				const castValue = rawObject[property] as any[]
				rawObject[property] = castValue.map((rawElement: any) => {
					if (isPlainObject(rawElement)) {
						return convertDates(rawElement)
					}

					return rawElement
				})
			}
		}
	}
	return rawObject
}
