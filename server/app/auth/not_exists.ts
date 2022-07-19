import type { Validator } from "node-input-validator"
import exists from "!/app/auth/exists"

/**
 * Function to validate if the value does not exists in the database.
 *
 * Accepts manager name and column name to check if the value does not exists to that area.
 */
export default async function(
	{ value, args }: { value: any, args: any[] },
	validator: Validator
): Promise<boolean> {
	return await exists({ value, args }, validator)
}
