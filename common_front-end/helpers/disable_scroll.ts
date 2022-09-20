import { Ref } from "vue"

import sanitizeArray from "$@/helpers/sanitize_array"

export default function(rawClasses: Ref, classesToAdd: string[]) {
	const classes = Array.from(rawClasses.value)
	for (const elementClass of classesToAdd) {
		if (classes.includes(elementClass)) {
			delete classes[classes.indexOf("unscrollable")]
		} else {
			classes.push(elementClass)
		}
	}

	rawClasses.value = sanitizeArray(classes)
}
