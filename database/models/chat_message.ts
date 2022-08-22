import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import type { GeneralObject } from "$/types/general"
import User from "%/models/user"
import Consultation from "%/models/consultation"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class ChatMessage extends Model {
	@Column({
		"allowNull": false,
		"type": DataType.JSON
	})
		data!: GeneralObject

	@ForeignKey(() => User)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User

	@ForeignKey(() => Consultation)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		consultationID!: number

	@BelongsTo(() => Consultation)
		consultation!: Consultation
}
