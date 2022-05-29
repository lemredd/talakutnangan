import User from "%/models/user"

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
}
