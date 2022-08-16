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
