import type { GeneralObject } from "$/types/general"
import isPlainObject from "$/type_guards/is_plain_object"

/**
 * Converts IDs into string.
 * @param value Object to convert
 */
export default function stringifyIDs(value: GeneralObject): GeneralObject {
	const objectName = value
	for (const property in value) {
		if (Object.hasOwn(value, property)) {
			if (property === "id") {
				objectName[property] = String(objectName[property])
			} else if (isPlainObject(objectName[property])) {
				objectName[property] = stringifyIDs(objectName[property])
			} else if (Array.isArray(objectName[property])) {
				objectName[property] = objectName[property].map(
					(element: GeneralObject) => stringifyIDs(element)
				)
			}
		}
	}
	return objectName
}
