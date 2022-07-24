import type { Pipe } from "$/types/database"
import type { RuleData } from "!/types/dependent"
import type { GeneralObject, MetaValidationConstraints } from "!/types/independent"

import Validator from "!/app/validators/validator"
import runThroughPipeline from "$/helpers/run_through_pipeline"

export default class StringValidator extends Validator {
	private lengthLimit: [number, number]|null = null

	constructor() {
		super("string")
	}

	inclusiveLength(minimum: number, maximum: number): StringValidator {
		this.lengthLimit = [ minimum, maximum ]

		return this
	}

	protected get dataObject(): GeneralObject {
		const data = super.dataObject as RuleData

		if (this.lengthLimit !== null) {
			data.min = this.lengthLimit[0]
			data.max = this.lengthLimit[1]
		}

		return data
	}

	protected get metaObject(): MetaValidationConstraints {
		const meta = super.metaObject
		const properCaster = (value: any) => String(value)

		if (meta.transformer) {
			const customTransformer = meta.transformer! as Pipe<any, {}>
			meta.transformer = (value: any) => {
				return runThroughPipeline(value, {}, [
					properCaster,
					customTransformer
				])
			}
		} else {
			meta.transformer = properCaster
		}

		return meta
	}
}
