import type { OptionInfo } from "$@/types/component"

export default function(value: any | any[], label?: string | string[]) {
	if (Array.isArray(value)) {
		const optionInfos: OptionInfo[] = []
		value.forEach((valueToMutate, index) => optionInfos.push({
			"label": Array.isArray(label) ? label[index] : String(valueToMutate),
			"value": valueToMutate
		}))

		return optionInfos
	}

	return {
		"label": label ? label : String(value),
		value
	}
}
