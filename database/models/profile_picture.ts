import {
	Table,
	Column,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import User from "%/models/user"
import FileLike from "%/models/file-like"

@Table({
	timestamps: true,
	paranoid: true
})
export default class ProfilePicture extends FileLike {
	@ForeignKey(() => User)
	@Column({
		allowNull: false
	})
	userID!: number

	@BelongsTo(() => User)
	user!: User
}
