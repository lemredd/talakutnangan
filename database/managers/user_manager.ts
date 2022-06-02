import { Op } from "sequelize"
import User from "%/models/user"
import type { Criteria, RawUser } from "%/types"

import compare from "!/helpers/auth/compare"

export default class UserManager {
	async findWithCredentials(email: string, password: string): Promise<User|null> {
		const foundUser = await User.findOne({
			where: {
				email
			}
		})

		if (foundUser !== null && await compare(password, foundUser.password)) {
			return foundUser
		} else {
			return null
		}
	}

	async findWithID(id: number): Promise<User|null> {
		return await User.findOne({ where: { id } })
	}

	async create(details: RawUser): Promise<User> {
		return await User.create({ ...details })
	}

	async list(criteria: Criteria|null): Promise<Array<User>> {
		const options: { [key: string]: object } = {}

		switch(criteria) {
			case "admitted": { // Complete profile and admitted
				// TODO
				break
			}
			case "unadmitted": { // Complete profile but not admitted
				options.emailVerifiedAt =  { [Op.not]: null }
				options.signature = { [Op.not]: null }
				options.admittedAt = { [Op.is]: null }
				break
			}
			case "incomplete": { // Incomplete profile
				// TODO
				break
			}
			default: // All users
		}

		const users = await User.findAll({ where: options })
		return users
	}

	async admit(id: number, confirm: boolean): Promise<number> {
		if (confirm) {
			const [ affectedCount ] = await User.update({
				admittedAt: new Date()
			}, {
				where: {
					id,
					admittedAt: { [Op.is]: null }
				}
			})

			return affectedCount
		} else {
			// TODO: Delete account and send e-mail
			return 1
		}
	}
}
