/**
 * @module DatabaseDependentTypes
 * @description This module exports types that are independent from any third-party packages.
 */
import {
	Attributes as BaseAttributes,
	UpdateOptions as BaseUpdateOptions,
	DestroyOptions as BaseDestroyOptions,
	RestoreOptions as BaseRestoreOptions,
	CreationAttributes as BaseCreationAttributes,
	FindOptions as BaseFindOptions,
	WhereOptions as BaseWhereOptions,
	FindAndCountOptions as BaseFindAndCountOptions
} from "sequelize"
import type {
	Model as BaseModel,
	ModelCtor as BaseModelCtor
} from "sequelize-typescript"
import {
	Context as BaseContext,
	AttributesObject as BaseAttributesObject,
	Options,
	RelationshipTransformerInfo as BaseRelationshipTransformerInfo
} from "jsonapi-fractal"

export type Model = BaseModel
export type FindOptions<T> = BaseFindOptions<T>
export type WhereOptions<T> = BaseWhereOptions<T>
export type UpdateOptions<T> = BaseUpdateOptions<T>
export type DestroyOptions<T> = BaseDestroyOptions<T>
export type RestoreOptions<T> = BaseRestoreOptions<T>
export type ModelCtor<T extends BaseModel> = BaseModelCtor<T>
export type FindAndCountOptions<T> = BaseFindAndCountOptions<T>
export type Attributes<T extends BaseModel> = BaseAttributes<T>
export type CreationAttributes<T extends BaseModel> = BaseCreationAttributes<T>
export type Context<T> = BaseContext<T>
export type AttributesObject = BaseAttributesObject
export type TransformerOptions = Options<void>
export type RelationshipTransformerInfo = BaseRelationshipTransformerInfo<void, unknown>
