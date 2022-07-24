import type { Pipe } from "$/types/database"
import type { Descriptor } from "!/types/independent"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import Validator from "!/app/validators/base/object"

export default class extends Validator {
	protected static TYPE_VALIDATOR: string = "array"

	constructor(fields: Descriptor) {
		super(fields)
	}

	protected transformAll(values: any, transformers: Pipe<any, {}>[]): any {
		return (values as any[]).map(value => runThroughPipeline(value, {}, transformers))
	}
}
