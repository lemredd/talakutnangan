import type { OptionInfo } from "$@/types/component"

export default function(value: any | any[]) {
	if (Array.isArray(value)) {
		const optionInfos: OptionInfo[] = []
		value.forEach(valueToMutate => optionInfos.push({
			"label": String(valueToMutate),
			"value": valueToMutate
		}))

		return optionInfos
	}

	return {
		"label": String(value),
		value
	}
}
