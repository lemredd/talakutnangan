import type { Validator } from "node-input-validator"

/**
 * Function to validate if the model exists in the database but has been archived.
 *
 * Accepts manager class and column name to check if the model has been archived.
 */
export default async function(
	{ value, args }: { value: any, args: any[] },
	validator: Validator
): Promise<boolean> {
	if (value !== undefined) {
		if (args.length < 1) {
			throw new Error("Number of arguments passed to `archived` rule is insufficient")
		}

		const rawManager = args[0]

		try {
			// TODO: Get transaction manager from cache
			const manager = new rawManager()
			const foundModel = await manager.findWithID(value, {
				filter: { existence: "archived" }
			})

			// TODO: Store found model in cache
			return Boolean(foundModel.data)
		} catch(error) {
			throw new Error("Manager cannot be instantiated")
		}
	} else {
		// Skip the validation if the field does not exists
		return true
	}
}
