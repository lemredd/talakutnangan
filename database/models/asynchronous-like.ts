import {
	Model,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import type { GeneralObject } from "$/types/general"

import User from "%/models/user"

export default abstract class extends Model {
	@Column({
		"allowNull": false
	})
		origin!: string

	@Column({
		"allowNull": false,
		"unique": true
	})
		token!: string

	@Column({
		"allowNull": false
	})
		finishedStepCount!: number

	@Column({
		"allowNull": false
	})
		totalStepCount!: number

	@Column({
		"allowNull": false
	})
		hasStopped!: boolean

	@Column({
		"allowNull": false,
		"type": DataType.JSON
	})
		extra!: GeneralObject

	@ForeignKey(() => User)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User
}
