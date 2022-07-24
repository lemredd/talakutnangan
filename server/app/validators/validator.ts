import type { GeneralObject, ValidationConstraints } from "!/types/independent"

export default abstract class Validator {
	private required: boolean = true
	private type: string
	private transformer: Function|null = null

	constructor(type: string) {
		this.type = type
	}

	optional(): Validator {
		this.required = false
		return this
	}

	transformBy(transformer: Function): Validator {
		this.transformer = transformer
		return this
	}

	get compiledObject(): ValidationConstraints {
		const meta: GeneralObject = {}

		if (this.transformer) {
			meta.transformer = this.transformer
		}

		return {
			data: {
				required: this.required,
				type: this.type
			},
			meta
		}
	}
}
