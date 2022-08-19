import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"
import User from "%/models/user"
import Consultation from "%/models/consultation"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class Consulter extends Model {
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
