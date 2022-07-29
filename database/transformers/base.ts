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
		if (model !== null && transformedData.included !== undefined) {
			transformedData.included = (transformedData.included as GeneralObject[]).map(data => {
				const transformerInfo = this.subtransformers[data.type]
				const transformer = transformerInfo.transformer
				if (transformer !== undefined && model !== null) {
					let relatedModel: any|null = null

					// ! Does not iterate deeper relationships
					if (model instanceof Array) {
						for (const unitModel of model) {
							const possibleRelatedModel = (unitModel as GeneralObject)[
								transformerInfo.attribute
							]

							if (possibleRelatedModel instanceof Array) {
								for (const possibleRelatedUnitModel of possibleRelatedModel) {
									if (possibleRelatedUnitModel?.id === data.id) {
										relatedModel = possibleRelatedUnitModel
										break
									}
								}
							} else if (possibleRelatedModel?.id === data.id) {
								relatedModel = possibleRelatedModel
								break
							}
						}
					} else {
						relatedModel = (model as GeneralObject)[transformerInfo.attribute] as any
					}

					return transformer.finalizeTransform(
						relatedModel,
						{ data } as Serializable
					).data as Serializable
				}

				return data
			})
		}

		return transformedData
	}
}
