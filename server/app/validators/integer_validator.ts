import type { Pipe } from "$/types/database"
import type { MetaValidationConstraints } from "!/types/independent"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import Validator from "!/app/validators/validator"

export default class extends Validator {
	constructor() {
		super("integer")
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
