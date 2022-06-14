import { Op } from "sequelize"

import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { Criteria, CommonConstraints, RawUser, Pipe } from "%/types/independent"

import Role from "%/models/role"
import User from "%/models/user"
import hash from "!/helpers/auth/hash"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import offset from "%/managers/helpers/offset"
import BaseManager from "%/managers/base_manager"
import siftByCriteria from "%/managers/user_manager/sift_by_criteria"

export default class UserManager extends BaseManager<User, RawUser> {
	get model(): ModelCtor<User> { return User }

	get listPipeline(): Pipe<FindAndCountOptions<User>, CommonConstraints & { criteria: Criteria }>[] {
		return [
			siftByCriteria,
			offset
		]
	}

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
