import type { RawUser } from "$!/types/independent"
import { Day, Pipe, DayValues } from "$/types/database"
import type { UserQueryParameters } from "$/types/query"
import type { GeneralObject, Serializable } from "$/types/general"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"
import type {
	Model as BaseModel,
	ModelCtor,
	FindAndCountOptions,
	FindOptions
} from "%/types/dependent"
import type {
	RawBulkData,
	ProcessedDataForStudent,
	ProcessedDataForEmployee,
	RawEmployeeSchedule
} from "%/types/independent"

import Log from "$!/singletons/log"
import deserialize from "$/object/deserialize"
import runThroughPipeline from "$/helpers/run_through_pipeline"

import Role from "%/models/role"
import Model from "%/models/user"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import EmployeeSchedule from "%/models/employee_schedule"

import BaseManager from "%/managers/base"
import RoleManager from "%/managers/role"
import UserTransformer from "%/transformers/user"
import DepartmentManager from "%/managers/department"
import UserProfileTransformer from "%/transformers/user_profile"

import hash from "$!/auth/hash"
import compare from "$!/auth/compare"
import Condition from "%/helpers/condition"
import siftBySlug from "%/queries/user/sift_by_slug"
import siftByRole from "%/queries/user/sift_by_role"
import siftByKind from "%/queries/user/sift_by_kind"
import siftByDepartment from "%/queries/user/sift_by_department"
import includeExclusiveDetails from "%/queries/user/include_exclusive_details"
import includeRoleAndDepartment from "%/queries/user/include_role_and_department"

export default class UserManager extends BaseManager<Model, RawUser, UserQueryParameters<number>> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): UserTransformer { return new UserTransformer() }

	get singleReadPipeline(): Pipe<FindAndCountOptions<Model>, UserQueryParameters<number>>[] {
		return [
			includeRoleAndDepartment,
			includeExclusiveDetails,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<FindAndCountOptions<Model>, UserQueryParameters<number>>[] {
		return [
			siftBySlug,
			siftByRole,
			siftByKind,
			siftByDepartment,
			includeRoleAndDepartment,
			...super.listPipeline
		]
	}

	async findWithCredentials(email: string, password: string): Promise<Serializable|null> {
		try {
			const condition = new Condition()
			condition.equal("email", email)
			const whereOptions: FindOptions<Model> = { "where": condition.build() }
			const findOptions = runThroughPipeline(whereOptions, {}, [
				includeExclusiveDetails,
				includeRoleAndDepartment
			])

			Log.trace("manager", "prepared query to find user with certain credential")

			const foundUser = await this.model.findOne({
				...findOptions,
				...this.transaction.transactionObject
			})

			Log.trace("manager", "done finding for user")

			if (foundUser !== null && await compare(password, foundUser.password)) {
				Log.success("manager", "found a matching user")
				return this.serialize(foundUser, {} as unknown as void, new UserProfileTransformer())
			}
			Log.errorMessage("manager", "matching user not found")
			return null
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async create(details: RawUser): Promise<Serializable> {
		try {
			details.password = await hash(details.password as string)
			return await super.create({ ...details })
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	protected get exposableColumns(): string[] {
		const excludedColumns = new Set([ "password", "departmentID", "prefersDark" ])
		return super.exposableColumns.filter(columnName => !excludedColumns.has(columnName))
	}

	async bulkCreate(bulkData: RawBulkData): Promise<Serializable> {
		try {
			const departmentManager = new DepartmentManager({
				"cache": this.cache,
				"transaction": this.transaction
			})
			const roleManager = new RoleManager({
				"cache": this.cache,
				"transaction": this.transaction
			})

			// Get the department name firsts
			const departmentNames = bulkData.importedCSV.map(data => data.department)

			Log.trace("manager", `prepared names for searching IDs: ${departmentNames.join(",")}`)

			// Find the IDs of the departments
			const pendingDepartments: Promise<Department>[] = []
			for (const departmentName of departmentNames) {
				const pendingDepartment = departmentManager.findOneOnColumn(
					"acronym",
					departmentName,
					{
						"filter": {
							"existence": "exists"
						}
					}
				).then(rawDepartment => {
					const deserializedDepartment = deserialize(
						rawDepartment
					) as DeserializedDepartmentDocument
					return Department.build({
						"acronym": deserializedDepartment.data.acronym,
						"fullName": deserializedDepartment.data.fullName,
						"id": deserializedDepartment.data.id,
						"mayAdmit": deserializedDepartment.data.mayAdmit
					})
				})

				pendingDepartments.push(pendingDepartment)
			}
			const departments: Department[] = await Promise.all(pendingDepartments)

			// Associate department info for faster access later
			const departmentIDs: { [key: string]: number } = departments.reduce(
				(previousMappings, department) => ({ ...previousMappings,
					[department.acronym]: department.id }), {})
			const departmentModels: { [key: string]: Department } = departments.reduce(
				(previousMappings, department) => ({ ...previousMappings,
					[`${department.id}`]: department }), {})

			Log.trace("manager", "found department IDs")

			// Find the IDs of the roles
			const roleIDs = bulkData.roles
			const pendingRoles: Promise<Role>[] = []
			for (const roleID of roleIDs) {
				const pendingRole = roleManager.findWithID(
					roleID,
					{
						"filter": {
							"existence": "exists"
						}
					}
				).then(rawRole => {
					const deserializedRole = deserialize(rawRole) as DeserializedRoleDocument
					const { ...roleAttributes } = deserializedRole.data
					return Role.build(roleAttributes as GeneralObject)
				})
				pendingRoles.push(pendingRole)
			}
			const roles: Role[] = await Promise.all(pendingRoles)
			const rolesToAttach = roles.reduce<{ roleID: number }[]>(
				(previousRoles, role) => [ ...previousRoles, { "roleID": role.id } ],
				[]
			)

			Log.trace("manager", "prepared roles to attach")

			// Preprocess the bulk data
			type ProcessedData = ProcessedDataForStudent | ProcessedDataForEmployee
			const incompleteProfiles: ProcessedData[] = await Promise
			.all(bulkData.importedCSV.map(async data => {
				const { password, department, ...securedData } = data
				return {
					...securedData,
					"attachedRoles": rolesToAttach,
					"departmentID": departmentIDs[department],
					"kind": bulkData.kind,
					"password": await hash(password)
				} as ProcessedData
			}))

			Log.trace("manager", "processed the data into general structure for bulk creation")

			if (bulkData.kind === "student") {
				return this.createStudents(
					incompleteProfiles as ProcessedDataForStudent[],
					departmentModels,
					roles
				)
			} else if (bulkData.kind === "reachable_employee") {
				return this.createReachableEmployees(
					incompleteProfiles as ProcessedDataForEmployee[],
					departmentModels,
					roles
				)
			} else if (bulkData.kind === "unreachable_employee") {
				return this.createUnreachableEmployees(
					incompleteProfiles as ProcessedDataForEmployee[],
					departmentModels,
					roles
				)
			}

			return {}
		} catch (error) {
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
				"emailVerifiedAt": new Date()
			}, {
				"where": condition.build(),
				...this.transaction.transactionObject
			})

			return affectedCount
		} catch (error) {
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
				"password": hashedPassword
			}, {
				"where": {
					id
				},
				...this.transaction.transactionObject
			})

			return affectedCount > 0
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	get modelChainToUser(): ModelCtor<BaseModel>[] {
		return []
	}

	private async createStudents(
		incompleteProfiles: ProcessedDataForStudent[],
		departmentModels: { [key:string]: Department },
		roles: Role[]
	): Promise<Serializable> {
		// Prepare for bulk student creation
		const normalizedProfiles = incompleteProfiles.map((
			incompleteProfile: ProcessedDataForStudent
		) => {
			const { studentNumber, ...incompleteNormalizedProfile } = incompleteProfile
			return { ...incompleteNormalizedProfile,
				"studentDetail": { studentNumber } }
		})

		Log.trace("manager", "specialized the data structure for student bulk creation")

		// Create the students in bulk
		const users = await this.model.bulkCreate(normalizedProfiles, {
			"include": [
				{
					"as": "attachedRoles",
					"model": AttachedRole
				},
				{
					"as": "studentDetail",
					"model": StudentDetail
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
	}

	private async createReachableEmployees(
		incompleteProfiles: ProcessedDataForEmployee[],
		departmentModels: { [key:string]: Department },
		roles: Role[]
	): Promise<Serializable> {
		// Prepare for bulk reachable employee creation
		const employeeSchedules = DayValues.reduce<RawEmployeeSchedule[]>((
			previousSchedule: RawEmployeeSchedule[],
			dayName: Day
		) => {
			if (dayName !== "saturday" && dayName !== "sunday") {
				// Start at 8am
				const scheduleStart = 60 * 60 * 8
				// End at 5pm
				const scheduleEnd = 60 * 60 * (12 + 5)
				return [ ...previousSchedule, {
					dayName,
					scheduleEnd,
					scheduleStart
				} ]
			}
			return previousSchedule
		}, [])
		const normalizedProfiles = incompleteProfiles.map((
			incompleteProfile: ProcessedDataForEmployee
		) => ({ ...incompleteProfile,
			employeeSchedules }))

		Log.trace("manager", "specialized the data structure for reachable employee bulk creation")

		// Create the reachable employees in bulk
		const users = await this.model.bulkCreate(normalizedProfiles, {
			"include": [
				{
					"as": "attachedRoles",
					"model": AttachedRole
				},
				{
					"as": "employeeSchedules",
					"model": EmployeeSchedule
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
	}

	private async createUnreachableEmployees(
		incompleteProfiles: ProcessedDataForEmployee[],
		departmentModels: { [key:string]: Department },
		roles: Role[]
	): Promise<Serializable> {
		// Unreachable employee profiles do not need other preprocessing
		const normalizedProfiles = incompleteProfiles.map((
			incompleteProfile: ProcessedDataForEmployee
		) => ({ ...incompleteProfile }))

		Log.trace(
			"manager",
			"specialized the data structure for unreachable employee bulk creation")

		// Create the reachable employees in bulk
		const users = await this.model.bulkCreate(normalizedProfiles, {
			"include": [
				{
					"as": "attachedRoles",
					"model": AttachedRole
				}
			],
			...this.transaction.transactionObject
		})

		Log.success("manager", "created unreachable employees in bulk")

		const completeUserInfo = users.map(user => {
			user.department = departmentModels[`${user.departmentID}`]
			user.roles = roles
			return user
		})

		Log.trace(
			"manager",
			"exiting user manager -> bulk create method with serialized unreachable employee info")


		return this.serialize(completeUserInfo)
	}
}
