import type { Serializable } from "$/types/database"

import { Transformer as BaseTransformer } from "jsonapi-fractal"

export default abstract class Transformer<T, U> extends BaseTransformer<T, U> {
	finalizeTransform(transformedData: Serializable): Serializable {
		return transformedData
	}
}
