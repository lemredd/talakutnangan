/**
 * @module TestingTestTypes
 * @description This module contains types that are only used in code for testing helping regardless
 * whether they are indepedent, dependent, or both.
 */

import type { Model, CreationAttributes } from "%/types/dependent"

export type GeneratedData<T extends Model> = Promise<CreationAttributes<T>>
