/**
 * @module DatabaseDependentTypes
 * @description This module exports types that are independent from any third-party packages.
 */
import type {
	Model as BaseModel,
	ModelCtor as BaseModelCtor
} from "sequelize-typescript"
import {
	Context as BaseContext,
	AttributesObject as BaseAttributesObject,
	Options,
	RelationshipTransformerInfo as BaseRelationshipTransformerInfo,
	TransformerRelationships as BaseTransformerRelationships
} from "jsonapi-fractal"
import {
	Attributes as BaseAttributes,
	CreateOptions as BaseCreateOptions,
	UpdateOptions as BaseUpdateOptions,
	DestroyOptions as BaseDestroyOptions,
	RestoreOptions as BaseRestoreOptions,
	CreationAttributes as BaseCreationAttributes,
	FindOptions as BaseFindOptions,
	WhereOptions as BaseWhereOptions,
	FindAndCountOptions as BaseFindAndCountOptions,
	IncludeOptions as BaseIncludeOptions
} from "sequelize"

export type Model = BaseModel
export type IncludeOptions = BaseIncludeOptions
export type FindOptions<T> = BaseFindOptions<T>
export type WhereOptions<T> = BaseWhereOptions<T>
export type CreateOptions<T> = BaseCreateOptions<T>
export type UpdateOptions<T> = BaseUpdateOptions<T>
export type DestroyOptions<T> = BaseDestroyOptions<T>
export type RestoreOptions<T> = BaseRestoreOptions<T>
export type ModelCtor<T extends BaseModel> = BaseModelCtor<T>
export type FindAndCountOptions<T> = BaseFindAndCountOptions<T>
export type Attributes<T extends BaseModel> = BaseAttributes<T>
export type CreationAttributes<T extends BaseModel> = BaseCreationAttributes<T>
export type Context<T> = BaseContext<T>
export type AttributesObject = BaseAttributesObject
export type TransformerOptions<T = void> = Options<T>
export type RelationshipTransformerInfo = BaseRelationshipTransformerInfo<void, unknown>
export type TransformerRelationships<T, U> = BaseTransformerRelationships<T, U>
