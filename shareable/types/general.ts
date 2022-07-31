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
		| string[]
		| number
		| number[]
		| boolean
		| boolean[]
		| null
		| Serializable[]
		| Serializable
		| undefined
}
