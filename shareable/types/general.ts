/**
 * Useful for general safe object
 */
export type GeneralObject<T = any> = { [key: string]: T }

/**
 * Used to indicate that a variable is serializable into a specific data format.
 */
export interface Serializable {
	[key: string]:
		| string
		| number
		| boolean
		| null
		| Serializable
		| undefined
		| (string|number|boolean|Serializable)[]
}

/**
 * Usually used to pick or patial construct certain relationships in documents.
 */
export type PartialOrPickObject<
	T extends string|undefined,
	U extends string,
	V extends GeneralObject
> = T extends U ? Pick<V, U> : Partial<V>
