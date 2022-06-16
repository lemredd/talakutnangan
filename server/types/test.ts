/**
 * @module TestTypes
 * @description This module contains types that are only used in testing regardless whether they are
 * indepedent, dependent, or both.
 */

import { Response } from "!/types/dependent"

/**
 * Used to cast a response properly.
 */
export type MockResponse = { [key: string]: jest.MockedFn<(_: number) => Response> }
