import type { GeneralObject } from "$/types/general"
import isString from "$/helpers/is_string"
import isPlainObject from "$/type_guards/is_object"

/**
 * Converts the value of string with At to date.
 * @param value Object to convert
 */
export default function convertDates(value: GeneralObject): GeneralObject {
	const objectName = value
	for (const property in value) {
		if (Object.hasOwn(value, property)) {
			if (property.endsWith("At")) {
				if (isString(objectName[property])) {
					objectName[property] = new Date(objectName[property])
				}
			} else if (isPlainObject(objectName[property])) {
				objectName[property] = convertDates(objectName[property])
			}
		}
	}
	return objectName
}
