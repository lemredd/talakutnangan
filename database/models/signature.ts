import {
	Table,
	Model,
	Column,
	BelongsTo,
	ForeignKey,
	DataType
} from "sequelize-typescript"

import User from "%/models/user"

@Table({
	timestamps: true,
	paranoid: true
})
export default class Signature extends Model {
	@ForeignKey(() => User)
	@Column({
		allowNull: false
	})
	userID!: number

	@Column({
		type: DataType.BLOB("medium"),
		allowNull: false
	})
	signature!: Buffer

	@BelongsTo(() => User)
	user!: User
}
