import { Op } from "sequelize"

import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { Criteria, CommonConstraints, RawUser, Pipe } from "$/types/database"

import Role from "%/models/role"
import User from "%/models/user"
import hash from "!/helpers/auth/hash"
import BaseManager from "%/managers/base"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import limit from "%/managers/helpers/limit"
import offset from "%/managers/helpers/offset"
import UserTransformer from "%/transformers/user"
import searchName from "%/managers/helpers/search_name"
import siftByCriteria from "%/managers/user/sift_by_criteria"

export default class UserManager extends BaseManager<User, RawUser> {
	get model(): ModelCtor<User> { return User }

	get transformer(): UserTransformer { return new UserTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<User>, CommonConstraints & { criteria: Criteria }>[] {
		return [
			searchName,
			siftByCriteria,
			offset,
			limit
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

	async create(details: RawUser): Promise<User> {
		details.password = await hash(details.password!)
		return await super.create({ ...details })
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
