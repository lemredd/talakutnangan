import { Ref } from "vue"

import sanitizeArray from "$@/helpers/sanitize_array"

export default function(rawBodyClasses: Ref) {
	const bodyClasses = Array.from(rawBodyClasses.value)
	if (bodyClasses.includes("unscrollable")) {
		delete bodyClasses[bodyClasses.indexOf("unscrollable")]
	} else {
		bodyClasses.push("unscrollable")
	}

	rawBodyClasses.value = sanitizeArray(bodyClasses)
}
