import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import { Day, DayValues } from "$/types/database"

import User from "%/models/user"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class EmployeeSchedule extends Model {
	@Column({
		"allowNull": false
	})
		scheduleStart!: number

	@Column({
		"allowNull": false
	})
		scheduleEnd!: number

	@Column({
		"allowNull": false,
		"type": DataType.ENUM(...DayValues)
	})
		dayName!: Day

	@ForeignKey(() => User)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User
}
