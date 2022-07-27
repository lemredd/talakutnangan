import { days } from "$/types/database.native"
import type { ModelCtor, FindAndCountOptions, FindOptions } from "%/types/dependent"
import type {
	RawBulkData,
	ProcessedDataForStudent,
	ProcessedDataForEmployee,
	RawEmployeeSchedule
} from "%/types/independent"
import type {
	Day,
	Pipe,
	RawUser,
	UserFilter,
	Serializable
} from "$/types/database"

import Log from "$!/singletons/log"
import runThroughPipeline from "$/helpers/run_through_pipeline"

import Role from "%/models/role"
import User from "%/models/user"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import EmployeeSchedule from "%/models/employee_schedule"

import BaseManager from "%/managers/base"
import UserTransformer from "%/transformers/user"

import hash from "$!/auth/hash"
import compare from "$!/auth/compare"
import Condition from "%/managers/helpers/condition"
import siftByRole from "%/managers/user/sift_by_role"
import siftByKind from "%/managers/user/sift_by_kind"
import searchName from "%/managers/helpers/search_name"
import siftByCriteria from "%/managers/user/sift_by_criteria"
import siftByDepartment from "%/managers/user/sift_by_department"
import includeRoleAndDepartment from "%/managers/user/include_role_and_department"
import includeExclusiveDetails from "%/managers/user/include_exclusive_details"

export default class UserManager extends BaseManager<User, RawUser, UserFilter> {
	get model(): ModelCtor<User> { return User }

	get transformer(): UserTransformer { return new UserTransformer() }

	get singleReadPipeline(): Pipe<FindAndCountOptions<User>, UserFilter>[] {
		return [
			includeRoleAndDepartment,
			includeExclusiveDetails,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<FindAndCountOptions<User>, UserFilter>[] {
		return [
			searchName,
			siftByRole,
			siftByKind,
			siftByCriteria,
			siftByDepartment,
			includeRoleAndDepartment,
			...super.listPipeline
		]
	}

	async findWithCredentials(email: string, password: string): Promise<Serializable|null> {
		try {
			const condition = new Condition()
			condition.equal("email", email)
			const whereOptions: FindOptions<User> = { where: condition.build() }
			const findOptions = runThroughPipeline(whereOptions, {}, [ includeRoleAndDepartment ])

			Log.trace("manager", "prepared query to find user with certain credential")

			const foundUser = await this.model.findOne({
				...findOptions,
				...this.transaction.lockedTransactionObject
			})

			Log.trace("manager", "done finding for user")

			if (foundUser !== null && await compare(password, foundUser.password)) {
				Log.success("manager", "found a matching user")
				return this.serialize(foundUser)
			} else {
				Log.errorMessage("manager", "matching user not found")
				return null
			}
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async create(details: RawUser): Promise<Serializable> {
		try {
			details.password = await hash(details.password!)
			return await super.create({ ...details })
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	protected get exposableColumns(): string[] {
		const excludedColumns = new Set([ "password", "departmentID" ])
		return super.exposableColumns.filter(columnName => !excludedColumns.has(columnName))
	}

	async bulkCreate(bulkData: RawBulkData): Promise<Serializable> {
		try {
			// Get the department name firsts
			const departmentNames = bulkData.importedCSV.map(data => data.department)

			Log.trace("manager", "prepared names for searching IDs: "+departmentNames.join(","))

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

			Log.trace("manager", "found department IDs")

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

			Log.trace("manager", "prepared roles to attach")

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

			Log.trace("manager", "processed the data into general structure for bulk creation")

			if (bulkData.kind === "student") {
				// Prepare for bulk student creation
				const normalizedProfiles = (incompleteProfiles as ProcessedDataForStudent[]).map((
					incompleteProfile: ProcessedDataForStudent
				) => {
					const { studentNumber, ...incompleteNormalizedProfile } = incompleteProfile
					return { ...incompleteNormalizedProfile, studentDetail: { studentNumber } }
				})

				Log.trace("manager", "specialized the data structure for student bulk creation")

				// Create the students in bulk
				const users = await this.model.bulkCreate(normalizedProfiles, {
					include: [
						{
							model: AttachedRole,
							as: "attachedRoles"
						},
						{
							model: StudentDetail,
							as: "studentDetail"
						}
					],
					...this.transaction.transactionObject
				})

				Log.success("manager", "created students in bulk")

				const completeUserInfo = users.map(user => {
					user.department = departmentModels[`${user.departmentID}`]
					user.roles = roles
					return user
				})

				return this.serialize(completeUserInfo)
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

				Log.trace("manager", "specialized the data structure for reachable employee bulk creation")

				// Create the reachable employees in bulk
				const users = await this.model.bulkCreate(normalizedProfiles, {
					include: [
						{
							model: AttachedRole,
							as: "attachedRoles"
						},
						{
							model: EmployeeSchedule,
							as: "employeeSchedules"
						}
					],
					...this.transaction.transactionObject
				})

				Log.success("manager", "created reachable employees in bulk")

				const completeUserInfo = users.map(user => {
					user.department = departmentModels[`${user.departmentID}`]
					user.roles = roles
					return user
				})

				Log.trace(
					"manager",
					"exiting user manager -> bulk create method with serialized reachable employee info")

				return this.serialize(completeUserInfo)
			} else {
				// TODO: Possibly throw error to prevent bulk creation of unreachable employees or make a
				// route
			}

			return {}
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async verify(id: number): Promise<number> {
		try {
			const condition = new Condition()
			condition.and(
				new Condition().equal("id", id),
				new Condition().is("emailVerifiedAt", null)
			)

			const [ affectedCount ] = await this.model.update({
				emailVerifiedAt: new Date()
			}, {
				where: condition.build(),
				...this.transaction.transactionObject
			})

			return affectedCount
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	/**
	 * Resets password and returns true if it has been successfully changed.
	 * @param id ID of the user to reset the password.
	 * @param rawPassword New password to put in the database.
	 */
	async resetPassword(id: number, rawPassword: string): Promise<boolean> {
		try {
			const hashedPassword = await hash(rawPassword)

			const [ affectedCount ] = await this.model.update({
				password: hashedPassword
			}, {
				where: {
					id
				},
				...this.transaction.transactionObject
			})

			return affectedCount > 0
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}
}
