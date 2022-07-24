import type { Pipe } from "$/types/database"
import type { RuleData } from "!/types/dependent"
import type { GeneralObject, MetaValidationConstraints } from "!/types/independent"

import Validator from "!/app/validators/base/base"
import runThroughPipeline from "$/helpers/run_through_pipeline"

export default class IntegerValidator extends Validator {
	private range: [number, number]|null = null

	constructor() {
		super("integer")
	}

	inclusiveRange(minimum: number, maximum: number): IntegerValidator {
		this.range = [ minimum, maximum ]

		return this
	}

	protected get dataObject(): GeneralObject {
		const data = super.dataObject as RuleData

		if (this.range !== null) {
			data.min = this.range[0]
			data.max = this.range[1]
		}

		return data
	}

	protected get metaObject(): MetaValidationConstraints {
		const meta = super.metaObject
		const properCaster = (value: any) => Number(value)

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
