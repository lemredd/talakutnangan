import { compare } from "bcryptjs"

export default async function(rawPassword, hashedPassword): Promise<boolean> {
	return compare(rawPassword, hashedPassword)
}
