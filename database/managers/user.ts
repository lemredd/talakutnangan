import { Op, HasOne, BelongsTo } from "sequelize"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type {
	RawBulkDataForStudents,
	RawBulkDataForEmployees,
	ProcessedDataForStudent,
	ProcessedDataForEmployee
} from "%/types/independent"
import type { Criteria, CommonConstraints, RawUser, Pipe, Serializable } from "$/types/database"

import Role from "%/models/role"
import User from "%/models/user"
import hash from "!/helpers/auth/hash"
import BaseManager from "%/managers/base"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import limit from "%/managers/helpers/limit"
import offset from "%/managers/helpers/offset"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import StudentDetail from "%/models/student_detail"
import Condition from "%/managers/helpers/condition"
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

	async bulkCreate(bulkData: RawBulkDataForStudents | RawBulkDataForEmployees): Promise<Serializable> {
		// Get the department name firsts
		const departmentNames = bulkData.importedCSV.map(data => data.department)
		// Find the IDs of the departments
		const departmentWhereConditions: Condition[] = departmentNames.reduce((
			conditions: Condition[],
			name: string
		) => {
			const condition = new Condition()
			condition.equal("acronym", name)
			return [ ...conditions, condition ]
		}, [])
		const departmentFindOptions = {
			where: (new Condition()).or(...departmentWhereConditions).build()
		}
		const departments = await Department.findAll(departmentFindOptions)
		const departmentIDs: { [key: string]: number } = departments.reduce(
			(previousMappings, department) => {
				return { ...previousMappings, [department.acronym]: department.id }
			}, {})

		// Preprocess the bulk data
		type ProcessedData = ProcessedDataForStudent | ProcessedDataForEmployee
		const incompleteProfiles: ProcessedData[] = await Promise.all(bulkData.importedCSV.map(async data => {
			const { password, department, ...securedData } = data
			return {
				...securedData,
				kind: bulkData.kind,
				password: await hash(password),
				departmentID: departmentIDs[department]
			} as ProcessedData
		}))

		if (bulkData.kind === "student") {
			// Prepare for bulk creation
			const normalizedProfiles = (incompleteProfiles as ProcessedDataForStudent[]).map((
				incompleteProfile: ProcessedDataForStudent
			) => {
				const { studentNumber, ...incompleteNormalizedProfile } = incompleteProfile
				return { ...incompleteNormalizedProfile, studentDetail: { studentNumber } }
			})

			// Create the students in bulk
			const users = await User.bulkCreate(normalizedProfiles, {
				include: [
					{
						model: StudentDetail,
						as: "studentDetail"
					}
				]
			})

			const departmentModels: { [key: string]: Department } = departments.reduce(
				(previousMappings, department) => {
					return { ...previousMappings, [`${department.id}`]: department }
				}, {})
			const completeUserInfo = users.map(user => {
				user.department = departmentModels[`${user.departmentID}`]
				return user
			})

			return Serializer.serialize(completeUserInfo, this.transformer)
		} else if (bulkData.kind === "reachable_employee") {

		} else {
			// TODO: Throw error to prevent bulk creation of unreachable employees or make a route
		}

		// const serializableData = Serializer.serialize(
		// 	incompleteProfiles,
		// 	transformer,
		// 	{}
		// )
		return {}
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
