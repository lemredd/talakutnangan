import type { Validator } from "node-input-validator"
import accessDeepPath from "!/helpers/access_deep_path"

import type { BaseManagerClass } from "!/types/independent"

/**
 * Function to validate if the value is/will be unique in the database.
 *
 * Accepts manager class and column name to check if the value is/will be unique to that area.
 */
export default async function(
	{ value, args }: { value: any, args: any[] },
	validator: Validator
): Promise<boolean> {
	if (value !== undefined) {
		if (args.length < 3) {
			throw new Error("Number of arguments passed to `unique` rule is insufficient")
		}

		const rawManager: BaseManagerClass = args[0]
		const columnName = args[1]
		const IDPath = args[2]

		try {
			// TODO: Get transaction manager from cache
			const manager = new rawManager()
			const foundModel = await manager.findOneOnColumn(columnName, value, {
				filter: {
					existence: "*"
				}
			})
			const id = +accessDeepPath(validator.inputs, IDPath)

			// TODO: Store found model in cache
			return foundModel.data === null || (
				!Number.isNaN(id) && (foundModel.data as any).id === id
			)
		} catch(error) {
			throw new Error("Manager cannot be instantiated in unique rule")
		}
	} else {
		// Skip the validation if the field does not exists
		return true
	}
}
