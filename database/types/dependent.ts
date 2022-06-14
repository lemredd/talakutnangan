/**
 * @module DatabaseDependentTypes
 * @description This module exports types that are independent from any third-party packages.
 */
import {
	FindOptions as BaseFindOptions,
	FindAndCountOptions as BaseFindAndCountOptions
} from "sequelize"
import type {
	Model as BaseModel,
	ModelCtor as BaseModelCtor
} from "sequelize-typescript"

export type Model = BaseModel
export type FindOptions<T> = BaseFindOptions<T>
export type ModelCtor<T extends BaseModel> = BaseModelCtor<T>
export type FindAndCountOptions<T> = BaseFindAndCountOptions<T>
