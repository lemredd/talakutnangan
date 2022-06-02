import { genSalt, hash } from "bcryptjs"

export default async function(rawPassword) {
	const salt = await genSalt(10)
	const hashedPassword = await hash(rawPassword, salt)
	return hashedPassword
}
