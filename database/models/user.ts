import {
	Table,
	Model,
	Column,
	HasOne,
	HasMany,
	DataType,
	BelongsTo,
	AllowNull,
	ForeignKey,
	BelongsToMany
} from "sequelize-typescript"
import { UserKind, UserKindValues } from "$/types/database"

import Role from "%/models/role"
import Signature from "%/models/signature"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import EmployeeSchedule from "%/models/employee_schedule"

@Table({
	timestamps: true,
	paranoid: true
})
export default class User extends Model {
	@Column({
		allowNull: false
	})
	name!: string

	@Column({
		unique: true,
		allowNull: false
	})
	email!: string

	@Column({
		allowNull: false
	})
	password!: string

	@Column({
		allowNull: false,
		type: DataType.ENUM(
			...UserKindValues
		)
	})
	kind!: UserKind

	@AllowNull
	@Column({
		type: DataType.DATE,
		defaultValue: null
	})
	emailVerifiedAt!: Date|null

	@Column({
		allowNull: false,
		type: DataType.BOOLEAN
	})
	prefersDark!: boolean

	@AllowNull
	@Column({
		type: DataType.DATE,
		defaultValue: null
	})
	admittedAt!: Date|null

	@ForeignKey(() => Department)
	@Column({
		allowNull: false
	})
	departmentID!: number

	@BelongsTo(() => Department)
	department!: Department

	@BelongsToMany(() => Role, () => AttachedRole)
	roles!: Role[]

	@HasMany(() => AttachedRole, "userID")
	attachedRoles!: AttachedRole[]

	@HasOne(() => Signature)
	signature?: Signature

	@HasOne(() => StudentDetail)
	studentDetail?: StudentDetail

	@HasMany(() => EmployeeSchedule)
	employeeSchedules?: EmployeeSchedule[]
}
