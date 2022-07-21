import { extend } from "node-input-validator"
import buffer from "!/app/auth/buffer"
import exists from "!/app/auth/exists"
import acronym from "!/app/auth/acronym"
import notExists from "!/app/auth/not_exists"
import unique from "!/app/auth/unique"

export default async function() {
	const customValidators: { [key: string]: (..._a: any[]) => Promise<boolean>|boolean }  = {
		acronym,
		buffer,
		exists,
		notExists,
		unique
	}

	for (const name in customValidators) {
		if (Object.prototype.hasOwnProperty.call(customValidators, name)) {
			const validator = customValidators[name]
			extend(name, validator)
		}
	}
}
