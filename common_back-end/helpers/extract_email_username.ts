/**
 * Helper function to generate email username.
 *
 * Useful for getting the default password of employees.
 *
 * @param email Email of a certain user.
 */
export default function(email: string): string {
	return email.split("@")[0]
}
