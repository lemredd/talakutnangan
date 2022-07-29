import type { GeneralObject } from "$/types/server"
import type { Serializable } from "$/types/database"

import { Transformer as BaseTransformer } from "jsonapi-fractal"

export default abstract class Transformer<T, U> extends BaseTransformer<T, U> {
	protected subtransformers: GeneralObject<BaseTransformer<any, any>> = {}

	finalizeTransform(transformedData: Serializable): Serializable {
		return transformedData
	}
}
