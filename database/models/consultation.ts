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

import Role from "%/models/role"
//import Message from "%/models/message"
import AttachedRole from "%/models/attached_role"

@Table({
	timestamps: true,
	paranoid: true
})
export default class Consultation extends Model {
	@ForeignKey(() => Role)
	@Column({
		allowNull: false
	})
	attachedRoleID!: number

	@Column({
		type: DataType.TEXT,
		allowNull: false
	})
	reason!: string

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
	actionTaken!: string

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
