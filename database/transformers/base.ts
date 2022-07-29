import type { GeneralObject } from "$/types/server"
import type { Serializable } from "$/types/database"

import { Transformer as BaseTransformer } from "jsonapi-fractal"
import isPlainObject from "$!/helpers/is_plain_object"

export default abstract class Transformer<T, U> extends BaseTransformer<T, U> {
	protected subtransformers: GeneralObject<Transformer<any, any>> = {}

	finalizeTransform(transformedData: Serializable): Serializable {
		if (
			transformedData.data !== undefined
			&& isPlainObject(transformedData.data)
			&& isPlainObject((transformedData.data as GeneralObject).relationships)
		) {
			for (const relationship in this.subtransformers) {
				if (Object.prototype.hasOwnProperty.call(this.subtransformers, relationship)) {
					const transformer = this.subtransformers[relationship]
					const resource = transformedData[relationship]

					if (resource !== undefined && isPlainObject(resource)) {
						transformedData[relationship] = transformer.finalizeTransform(
							resource as Serializable
						)
					}
				}
			}
		}

		return transformedData
	}
}
