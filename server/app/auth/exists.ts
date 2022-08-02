import type { Validator } from "node-input-validator"

/**
 * Function to validate if the value exists in the database.
 *
 * Accepts manager class and column name to check if the value exists to that area.
 */
export default async function(
	{ value, args }: { value: any, args: any[] },
	validator: Validator
): Promise<boolean> {
	if (value !== undefined) {
		if (args.length < 2) {
			throw new Error("Number of arguments passed to `exists` rule is insufficient")
		}

		const rawManager = args[0]
		const columnName = args[1]

		try {
			// TODO: Get transaction manager from cache
			const manager = new rawManager()
			const foundModel = await manager.findOneOnColumn(columnName, value, {
				filter: {
					existence: "exists"
				}
			})

			// TODO: Store found model in cache
			return foundModel.data !== null
		} catch(error) {
			throw new Error("Manager cannot be instantiated in non-exists/exists rule")
		}
	} else {
		// Skip the validation if the field does not exists
		return true
	}
}
