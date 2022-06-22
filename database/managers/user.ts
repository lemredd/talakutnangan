import { Op } from "sequelize"
import { days } from "$/types/database.native"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type {
	RawBulkDataForStudents,
	RawBulkDataForEmployees,
	ProcessedDataForStudent,
	ProcessedDataForEmployee,
	RawEmployeeSchedule
} from "%/types/independent"
import type {
	Day,
	Pipe,
	Criteria,
	RawUser,
	Serializable,
	CommonConstraints
} from "$/types/database"

import Role from "%/models/role"
import User from "%/models/user"
import hash from "!/helpers/auth/hash"
import BaseManager from "%/managers/base"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import limit from "%/managers/helpers/limit"
import offset from "%/managers/helpers/offset"
import AttachedRole from "%/models/attached_role"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import StudentDetail from "%/models/student_detail"
import Condition from "%/managers/helpers/condition"
import searchName from "%/managers/helpers/search_name"
import EmployeeSchedule from "%/models/employee_schedule"
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

	async bulkCreate(bulkData: RawBulkDataForStudents | RawBulkDataForEmployees)
		: Promise<Serializable> {
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
		const departmentModels: { [key: string]: Department } = departments.reduce(
			(previousMappings, department) => {
				return { ...previousMappings, [`${department.id}`]: department }
			}, {})

		// Find the IDs of the roles
		const roleWhereConditions: Condition[] = bulkData.roles.reduce((
			conditions: Condition[],
			name: string
		) => {
			const condition = new Condition()
			condition.equal("name", name)
			return [ ...conditions, condition ]
		}, [])
		const roles = await Role.findAll({
			where: (new Condition()).or(...roleWhereConditions).build()
		})
		const rolesToAttach = roles.reduce<{ roleID: number }[]>((previousRoles, role) => {
			return [ ...previousRoles, { roleID: role.id } ]
		}, [])

		// Preprocess the bulk data
		type ProcessedData = ProcessedDataForStudent | ProcessedDataForEmployee
		const incompleteProfiles: ProcessedData[] = await Promise.all(bulkData.importedCSV.map(async data => {
			const { password, department, ...securedData } = data
			return {
				...securedData,
				kind: bulkData.kind,
				password: await hash(password),
				departmentID: departmentIDs[department],
				attachedRoles: rolesToAttach
			} as ProcessedData
		}))

		if (bulkData.kind === "student") {
			// Prepare for bulk student creation
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
						model: AttachedRole,
						as: "attachedRoles"
					},
					{
						model: StudentDetail,
						as: "studentDetail"
					}
				]
			})

			const completeUserInfo = users.map(user => {
				user.department = departmentModels[`${user.departmentID}`]
				user.roles = roles
				return user
			})

			return Serializer.serialize(completeUserInfo, this.transformer)
		} else if (bulkData.kind === "reachable_employee") {
			// Prepare for bulk reachable employee creation
			const employeeSchedules = days.reduce<RawEmployeeSchedule[]>((
				previousSchedule: RawEmployeeSchedule[],
				dayName: Day
			) => {
				if (dayName !== "saturday" && dayName !== "sunday") {
					const scheduleStart = 60*60*8 // Start at 8am
					const scheduleEnd = 60*60*(12+5) // End at 5pm
					return [ ...previousSchedule, {
						scheduleStart,
						scheduleEnd,
						dayName
					}]
				} else {
					return previousSchedule
				}
			}, [])
			const normalizedProfiles = (incompleteProfiles as ProcessedDataForEmployee[]).map((
				incompleteProfile: ProcessedDataForEmployee
			) => {
				return { ...incompleteProfile, employeeSchedules }
			})

			// Create the reachable employees in bulk
			const users = await User.bulkCreate(normalizedProfiles, {
				include: [
					{
						model: AttachedRole,
						as: "attachedRoles"
					},
					{
						model: EmployeeSchedule,
						as: "employeeSchedules"
					}
				]
			})

			const completeUserInfo = users.map(user => {
				user.department = departmentModels[`${user.departmentID}`]
				user.roles = roles
				return user
			})

			return Serializer.serialize(completeUserInfo, this.transformer)
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
