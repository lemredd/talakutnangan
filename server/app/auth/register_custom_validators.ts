import { extend } from "node-input-validator"
import buffer from "!/app/auth/buffer"
import acronym from "!/app/auth/acronym"

export default async function() {
	const customValidators: { [key: string]: (..._a: any[]) => Promise<boolean>|boolean }  = {
		acronym,
		buffer
	}

	for (const name in customValidators) {
		if (Object.prototype.hasOwnProperty.call(customValidators, name)) {
			const validator = customValidators[name]
			extend(name, validator)
		}
	}
}
