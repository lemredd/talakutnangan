import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	AllowNull,
	ForeignKey
} from "sequelize-typescript"
import { UserKind } from "%/types"
import Department from "%/models/department"

@Table({
	timestamps: true,
	paranoid: true
})
export default class User extends Model {
	@Column({
		allowNull: false
	})
	name: string

	@Column({
		unique: true,
		allowNull: false
	})
	email: string

	@Column({
		allowNull: false
	})
	password: string

	@Column({
		allowNull: false,
		type: DataType.ENUM(
			UserKind.UnreachableEmployee,
			UserKind.ReachableEmployee,
			UserKind.Student
		)
	})
	kind: UserKind

	@AllowNull
	@Column({
		defaultValue: null
	})
	emailVerifiedAt: Date|null

	@AllowNull
	@Column({
		defaultValue: null
	})
	admittedAt: Date|null

	@AllowNull
	@Column({
		type: DataType.BLOB("medium"),
		defaultValue: null
	})
	signature: Buffer|null

	@ForeignKey(() => Department)
	@Column({
		allowNull: false
	})
	departmentID: number

	@BelongsTo(() => Department)
	department: Department
}
