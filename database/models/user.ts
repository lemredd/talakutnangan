import { Table, Model, Column, DataType, AllowNull } from "sequelize-typescript"
import { UserKind } from "%/types"

@Table({
	timestamps: true,
	paranoid: true
})
export default class User extends Model {
	@Column({
		unique: true,
	})
	email: string

	@Column
	password: string

	@Column({
		type: DataType.ENUM(
			UserKind.UnreachableEmployee,
			UserKind.ReachableEmployee,
			UserKind.Student
		)
	})
	kind: UserKind

	@AllowNull
	@Column
	emailVerifiedAt: Date|null

	@AllowNull
	@Column
	admittedAt: Date|null

	@AllowNull
	@Column({
		type: DataType.BLOB("medium")
	})
	signature: Buffer|null
}
