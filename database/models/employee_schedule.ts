import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import type { Day } from "$/types/database"
import { days } from "$/types/database.native"

import User from "%/models/user"

@Table({
	timestamps: true,
	paranoid: true
})
export default class EmployeeSchedule extends Model {
	@Column({
		allowNull: false
	})
	scheduleStart!: number

	@Column({
		allowNull: false
	})
	scheduleEnd!: number

	@Column({
		allowNull: false,
		type: DataType.ENUM(...days)
	})
	dayName!: Day

	@ForeignKey(() => User)
	@Column({
		allowNull: false
	})
	userID!: number

	@BelongsTo(() => User)
	user!: User
}
