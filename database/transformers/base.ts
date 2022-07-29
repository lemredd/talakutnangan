import type { GeneralObject } from "$/types/server"
import type { Serializable } from "$/types/database"

import { Transformer as BaseTransformer } from "jsonapi-fractal"

export default abstract class Transformer<T, U> extends BaseTransformer<T, U> {
	/**
	 * The key should be the type of resource being transformed
	 */
	protected subtransformers: GeneralObject<Transformer<any, any>> = {}

	finalizeTransform(transformedData: Serializable): Serializable {
		if (transformedData.included !== undefined) {
			transformedData.included = (transformedData.included as GeneralObject[]).map(data => {
				const transformer = this.subtransformers[data.type]
				if (transformer === undefined) {
					return data
				} else {
					return transformer.finalizeTransform({ data } as Serializable).data as Serializable
				}
			})
		}

		return transformedData
	}
}
