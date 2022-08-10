import {
	Table,
	Model,
	Column,
	BelongsTo,
	DataType,
	ForeignKey
} from "sequelize-typescript"
import User from "%/models/user"
import Role from "%/models/role"
import Consultation from "%/models/consultation"

@Table({
	timestamps: true,
	paranoid: true
})
export default class AttachedRole extends Model {
	@ForeignKey(() => User)
	@Column({
		allowNull: false,
		type: DataType.BIGINT
	})
	userID!: number

	@BelongsTo(() => User)
	user!: User

	@ForeignKey(() => Role)
	@Column({
		allowNull: false,
		type: DataType.BIGINT
	})
	roleID!: number

	@BelongsTo(() => Role)
	role!: Role

	@BelongsTo(() => Consultation)
	consultation!: Consultation
}
