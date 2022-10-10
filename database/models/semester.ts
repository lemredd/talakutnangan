import {
	Table,
	Model,
	Column,
	DataType
} from "sequelize-typescript"

import { Order, OrderValues } from "$/types/database"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class Semester extends Model {
	@Column({
		"allowNull": false,
		"type": DataType.STRING
	})
		name!: string

	@Column({
		"allowNull": false,
		"type": DataType.ENUM(
			...OrderValues
		)
	})
		semesterOrder!: Order

	@Column({
		"allowNull": false,
		"type": DataType.DATE
	})
		startAt!: Date

	@Column({
		"allowNull": false,
		"type": DataType.DATE
	})
		endAt!: Date
}
