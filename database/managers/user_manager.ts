import User from "%/models/user"
import type { RawUser } from "%/types"

export default class UserManager {
	async findWithCredentials(email: string, password: string): Promise<User|null> {
		// TODO: Encrypt the password

		return await User.findOne({
			where: {
				email,
				password
			}
		})
	}

	async findWithID(id: number): Promise<User|null> {
		return await User.findOne({ where: { id } })
	}

	async create(details: RawUser): Promise<User> {
		return await User.create({ ...details })
	}
}
