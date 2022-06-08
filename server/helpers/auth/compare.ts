import { compare } from "bcryptjs"

export default async function(rawPassword, hashedPassword): Promise<boolean> {
	return await compare(rawPassword, hashedPassword)
}
