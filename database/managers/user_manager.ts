import User from "%/models/user"

export default class UserManager {
	async searchUserByCredentials(
		email: string,
		password: string
	): Promise<User> {
		// TODO: Encrypt the password

		return await User.findOne({
			where: {
				email,
				password
			}
		})
	}

	async findUsingID(id: number): Promise<User> {
		return await User.findOne({ where: { id } })
	}
}
