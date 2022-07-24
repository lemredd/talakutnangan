import type { Pipe } from "$/types/database"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import type { MetaValidationConstraints } from "!/types/independent"

export default function(meta: MetaValidationConstraints, caster: Pipe<any, {}>)
: MetaValidationConstraints {
	if (meta.transformer) {
		const customTransformer = meta.transformer! as Pipe<any, {}>
		meta.transformer = (value: any) => {
			return runThroughPipeline(value, {}, [
				caster,
				customTransformer
			])
		}
	} else {
		meta.transformer = caster
	}

	return meta
}
