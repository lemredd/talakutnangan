import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	AllowNull,
	ForeignKey
} from "sequelize-typescript"

import User from "%/models/user"

@Table({
	timestamps: true,
	paranoid: true
})
export default class ProfilePicture extends Model {
	@ForeignKey(() => User)
	@Column({
		allowNull: false
	})
	userID!: number

	@AllowNull
	@Column({
		type: DataType.BLOB("medium"),
		defaultValue: null
	})
	file!: Buffer|null

	@BelongsTo(() => User)
	user!: User
}
