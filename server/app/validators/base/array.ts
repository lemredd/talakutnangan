import type { Pipe } from "$/types/database"
import type { Descriptor } from "!/types/independent"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import Validator from "!/app/validators/base/object"

export default class extends Validator {
	constructor(fields: Descriptor) {
		super(fields, "array")
	}

	protected transformAll(values: any, transformers: Pipe<any, {}>[]): any {
		if (values instanceof Array) {
			return values.map(value => runThroughPipeline(value, {}, transformers))
		}

		return values
	}
}
