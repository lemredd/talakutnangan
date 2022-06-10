import { genSalt, hash } from "bcryptjs"

export default async function(rawPassword): Promise<string> {
	const salt = await genSalt(+process.env.SECURITY_SALT_ROUNDS || 10)
	const hashedPassword = await hash(rawPassword, salt)
	return hashedPassword
}
