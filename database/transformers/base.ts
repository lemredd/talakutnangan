import type { GeneralObject } from "$/types/server"
import type { Serializable } from "$/types/database"

import { Transformer as BaseTransformer } from "jsonapi-fractal"

export default abstract class Transformer<T, U> extends BaseTransformer<T, U> {
	/**
	 * The key should be the type of resource being transformed.
	 *
	 * Note that the `attribute` key in the object value is a property in the model which contains
	 * the related model.
	 */
	protected subtransformers: GeneralObject<{
		attribute: string,
		transformer: Transformer<any, any>
	}> = {}

	finalizeTransform(model: T|T[]|null, transformedData: Serializable): Serializable {
		if (transformedData.included !== undefined) {
			transformedData.included = (transformedData.included as GeneralObject[]).map(data => {
				const transformer = this.subtransformers[data.type].transformer
				if (transformer === undefined) {
					return data
				} else {
					// TODO: make another hash to get the attributes properly
					return transformer.finalizeTransform(null, { data } as Serializable).data as Serializable
				}
			})
		}

		return transformedData
	}
}
