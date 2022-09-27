import { genSalt, hash } from "bcryptjs"

export default async function(rawPassword: string): Promise<string> {
	const salt = await genSalt(Number(process.env.SECURITY_HASH_SALT_ROUNDS || "10"))
	const hashedPassword = await hash(rawPassword, salt)
	return hashedPassword
}
