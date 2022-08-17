import { Transformer as BaseTransformer } from "jsonapi-fractal"

import type { GeneralObject, Serializable } from "$/types/general"
import type { ResourceIdentifier, Resource } from "$/types/documents/base"
import type {
	TransformerOptions,
	RelationshipTransformerInfo,
	TransformerRelationships
} from "%/types/dependent"

import Serializer from "%/transformers/serializer"
import processData from "%/transformers/helpers/process_data"

type Subtransformer = {
	attribute: string,
	// eslint-disable-next-line no-use-before-define
	transformer: Transformer<any, any>
}

type SubtransformerList = Subtransformer[]

export default abstract class Transformer<T, U> extends BaseTransformer<T, U> {
	/**
	 * The key should be the type of resource being transformed.
	 *
	 * Note that the `attribute` key in the object value is a property in the model which contains
	 * the related model.
	 */
	public readonly subtransformers: SubtransformerList

	constructor(type: string, subtransformers: SubtransformerList = []) {
		super()
		this.type = type
		this.subtransformers = subtransformers

		if (subtransformers.length > 0) {
			this.relationships = subtransformers.reduce(
				(previousRelationships, subtransformer) => {
					const compiledRelationships = {
						...previousRelationships,
						[subtransformer.attribute]: (
							model: T,
							options: U
						): RelationshipTransformerInfo => this.makeRelationshipTransformerInfo(
							model,
							subtransformer.attribute,
							options
						)
					} as TransformerRelationships<T, U>

					return compiledRelationships
				},
				{}
			)
		}
	}

	finalizeTransform(model: T|T[]|null, transformedData: Serializable): Serializable {
		if (model !== null && transformedData.included) {
			const newIncluded: Resource<any, any> = []

			const relationshipProcessor = (rawUnitData: any) => {
				const unitData = rawUnitData as GeneralObject
				if (unitData.relationships) {
					const { relationships } = unitData as { relationships: GeneralObject }

					for (const relationshipName in relationships) {
						if (Object.prototype.hasOwnProperty.call(relationships, relationshipName)) {
							const relationship = relationships[relationshipName]
							processData(
								relationship.data,
								relationshipUnit => this.processLinkage(
									model,
									transformedData,
									newIncluded,
									relationshipUnit as ResourceIdentifier<any>,
									relationshipName
								)
							)
						}
					}
				}
			}

			processData(transformedData.data as GeneralObject[], relationshipProcessor)

			// @ts-ignore
			transformedData.included.push(...newIncluded)
		}

		return transformedData
	}

	protected makeRelationshipTransformerInfo(
		model: T,
		attributeName: string,
		options: TransformerOptions
	): RelationshipTransformerInfo {
		return Serializer.makeContext(
			// @ts-ignore
			model[attributeName] || null,
			this.findTransformer(attributeName),
			options
		)
	}

	protected findTransformer(attributeName: string): Transformer<any, any> {
		const subtransformer = this.subtransformers.find(info => info.attribute === attributeName)

		if (typeof subtransformer === "undefined") {
			throw new Error(
				`Developer is looking for a transformer with a missing attribute "${attributeName}".`
			)
		} else {
			return subtransformer.transformer
		}
	}

	private findResource(included: Resource<any, any>[], resourceLinkage: ResourceIdentifier<any>)
	: Resource<any, any>|null {
		const index = included.findIndex(includedResource => {
			const doesMatch = includedResource.type === resourceLinkage.type
				&& includedResource.id !== resourceLinkage.id
			return doesMatch
		})

		if (index > -1) {
			const resourceObject = included.splice(index, 1)
			return resourceObject[0]
		}

		return null
	}

	findWithinModels(models: T[], attribute: string, id: number): any|null {
		let relatedModel: any|null = null

		for (const unitModel of models) {
			const castUnitModel = unitModel as GeneralObject
			const possibleRelatedModel = castUnitModel[attribute]

			if (possibleRelatedModel instanceof Array) {
				for (const possibleRelatedUnitModel of possibleRelatedModel) {
					if (possibleRelatedUnitModel?.id === id) {
						relatedModel = possibleRelatedUnitModel
						break
					}
				}
			} else if (possibleRelatedModel?.id === id) {
				relatedModel = possibleRelatedModel
				break
			}
		}

		return relatedModel
	}

	findModel(model: T|T[], attribute: string, id: number): any|null {
		let relatedModel: any|null = null

		// ! Does not iterate deeper relationships
		if (model instanceof Array) {
			relatedModel = this.findWithinModels(model, attribute, id)
		} else {
			const castModel = model as GeneralObject
			relatedModel = castModel[attribute] as any
		}

		return relatedModel
	}

	private processLinkage(
		model: T|T[]|null,
		transformedData: Serializable,
		newIncluded: Resource<any, any>,
		resourceLinkage: ResourceIdentifier<any>,
		attributeName: string
	): void {
		const resourceObject = this.findResource(
			transformedData.included as Resource<any, any>[],
			resourceLinkage
		)

		if (typeof resourceObject !== "undefined" || resourceObject !== null) {
			const transformerInfo = this.subtransformers.find(
				subtransformerInfo => subtransformerInfo.attribute === attributeName
			) as Subtransformer

			const { transformer } = transformerInfo

			if (transformer && model !== null) {
				const relatedModel = this.findModel(model, transformerInfo.attribute, resourceObject.id)

				const newResourceObject = transformer.finalizeTransform(
					relatedModel,
					resourceObject as Serializable
				) as Serializable

				newIncluded.push(newResourceObject)
			}
		}
	}
}
