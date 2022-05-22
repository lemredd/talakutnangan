import { EntityManager } from "typeorm"
import User from "!/models/user"

export default async function(
	manager: EntityManager,
	email: string,
	password: string
): Promise<User> {
	return await manager.findOne(User, {
		where: {
			email,
			password
		}
	})
}
