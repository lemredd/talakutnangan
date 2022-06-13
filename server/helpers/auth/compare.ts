import { compare } from "bcryptjs"

export default async function(rawPassword: string, hashedPassword: string): Promise<boolean> {
	return await compare(rawPassword, hashedPassword)
}
