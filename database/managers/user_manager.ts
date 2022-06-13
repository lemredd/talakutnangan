import { Op, FindAndCountOptions } from "sequelize"

import Role from "%/models/role"
import User from "%/models/user"
import hash from "!/helpers/auth/hash"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import type { Criteria, RawUser } from "%/types"

export default class UserManager {
	async findWithCredentials(email: string, password: string): Promise<User|null> {
		const foundUser = await User.findOne({
			where: {
				email
			},
			include: [ Role, Department ]
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
		details.password = await hash(details.password!)
		return await User.create({ ...details })
	}

	async list(criteria: Criteria|null, offset: number): Promise<{
		records: User[],
		count: number
	}> {
		const options: FindAndCountOptions<User> = {
			offset
		}

		switch(criteria) {
			case "incomplete": { // Incomplete profile
				// ?: Should password be included?
				options.where = {
					[Op.or]: {
						emailVerifiedAt: { [Op.is]: null },
						signature: { [Op.is]: null }
					}
				}
				break
			}
			case "complete": { // Complete profile
				options.where = {
					emailVerifiedAt: { [Op.not]: null },
					signature: { [Op.not]: null }
				}
				break
			}
			case "all":
			default: { // All users
				break
			}
		}

		const { rows, count } = await User.findAndCountAll(options)
		return { records: rows, count }
	}

	async verify(email: string): Promise<number> {
		const [ affectedCount ] = await User.update({
			emailVerifiedAt: new Date()
		}, {
			where: {
				email,
				emailVerifiedAt: { [Op.is]: null }
			}
		})

		return affectedCount
	}

	/**
	 * Resets password and returns true if it has been successfully changed.
	 * @param id ID of the user to reset the password.
	 * @param rawPassword New password to put in the database.
	 */
	async resetPassword(id: number, rawPassword: string): Promise<boolean> {
		// TODO: use the student number or random password
		const hashedPassword = await hash(rawPassword)

		const [ affectedCount ] = await User.update({
			password: hashedPassword
		}, {
			where: {
				id
			}
		})

		return affectedCount > 0
	}
}
