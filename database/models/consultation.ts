import {
	Table,
	Model,
	Column,
	DataType,
	AllowNull,
	BelongsTo,
	ForeignKey,
	BelongsToMany
} from "sequelize-typescript"
import { Status, StatusValues } from "$/types/database"

import User from "%/models/user"
import Consulter from "%/models/consulter"
import AttachedRole from "%/models/attached_role"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class Consultation extends Model {
	@Column({
		"allowNull": false,
		"type": DataType.TEXT
	})
		reason!: string

	@Column({
		"allowNull": false,
		"type": DataType.ENUM(
			...StatusValues
		)
	})
		status!: Status

	@Column({
		"allowNull": false,
		"type": DataType.TEXT
	})
		actionTaken!: string

	@Column({
		"allowNull": false,
		"type": DataType.DATE
	})
		scheduledStartDatetime!: Date

	@AllowNull
	@Column({
		"defaultValue": null,
		"type": DataType.DATE
	})
		endDatetime!: Date|null

	@ForeignKey(() => AttachedRole)
	@Column({
		"allowNull": false
	})
		attachedRoleID!: number

	@BelongsTo(() => AttachedRole)
		facilitatorInfo!: AttachedRole

	@BelongsToMany(() => User, () => Consulter)
		consulters!: User[]

	/*
	 * @HasMany(() => Message)
	 * message?: Message
	 */

	// TODO Message

	// TODO Consultation Requesters

	// TODO Chat Message Activity
}
