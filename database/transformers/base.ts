import type { GeneralObject } from "$/types/server"
import type { Serializable } from "$/types/database"

import { Transformer as BaseTransformer } from "jsonapi-fractal"

export default abstract class Transformer<T, U> extends BaseTransformer<T, U> {
	protected subtransformers: GeneralObject<Transformer<any, any>> = {}

	finalizeTransform(transformedData: Serializable): Serializable {
		if (transformedData.included !== undefined) {
			transformedData.included = (transformedData.included as GeneralObject[]).map(data => {
				const transformer = this.subtransformers[data.type]
				const resource = data as Serializable

				return transformer.finalizeTransform(resource)
			})
		}

		return transformedData
	}
}
