import { extend } from "node-input-validator"

export default async function() {
	const customValidators: { [key: string]: () => boolean }  = {

	}

	for (const name in customValidators) {
		if (Object.prototype.hasOwnProperty.call(customValidators, name)) {
			const validator = customValidators[name]
			extend(name, validator)
		}
	}
}
