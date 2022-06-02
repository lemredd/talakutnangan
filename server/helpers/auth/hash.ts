import { genSalt, hash } from "bcryptjs"

export default async function(rawPassword): Promise<string> {
	const salt = await genSalt(10)
	const hashedPassword = await hash(rawPassword, salt)
	return hashedPassword
}
