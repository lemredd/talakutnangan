import {
	Table,
	Model,
	Column,
	HasOne,
	HasMany,
	DataType,
	AllowNull,
	BelongsTo,
	ForeignKey,
	BelongsToMany
} from "sequelize-typescript"
import { Status, StatusValues} from "$/types/database"

import User from "%/models/user"
import Role from "%/models/role"
//import Message from "%/models/message"
import AttachedRole from "%/models/attached_role"

@Table({
	timestamps: true,
	paranoid: true
})
export default class StudentDetail extends Model {
	@ForeignKey(() => Role)
	@Column({
		allowNull: false
	})
	attachedRoleID!: number

	@Column({
		type: DataType.TEXT,
		allowNull: false
	})
	reason!: Text

	@Column({
		allowNull: false,
		type: DataType.ENUM(
			...StatusValues
		)
	})
	status!: Status

	@Column({
		type: DataType.TEXT,
		allowNull: false
	})
	actionTaken!: Text

	@Column({
		type: DataType.DATE,
		allowNull: false
	})
	scheduledStartDatetime!: Date

	@AllowNull
	@Column({
		type: DataType.DATE,
		defaultValue: null
	})
	endDatetime!: Date|null

	// @HasMany(() => Message)
	// message?: Message

	// TODO Message

	@BelongsToMany(() => Role, () => AttachedRole)
	roles!: Role[]

	// TODO Consultation Requesters

	// TODO Chat Message Activity
}
