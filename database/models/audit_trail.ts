import {
	Table,
	Model,
	Column,
	BelongsTo,
	ForeignKey,
	DataType,
	AllowNull
} from "sequelize-typescript"

import type { GeneralObject } from "$/types/general"
import User from "%/models/user"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class AuditTrail extends Model {
	@AllowNull
	@ForeignKey(() => User)
	@Column({
		"type": DataType.BIGINT
	})
		userID!: number|null

	@Column({
		"allowNull": false,
		"type": DataType.STRING
	})
		actionName!: string

	@Column({
		"allowNull": false,
		"type": DataType.JSON
	})
		extra!: GeneralObject

	@BelongsTo(() => User)
		user!: User|null
}
