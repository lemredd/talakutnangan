import {
	Table,
	Model,
	Column,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import User from "%/models/user"

@Table({
	"timestamps": true,
	"paranoid": true
})
export default class StudentDetail extends Model {
	@Column({
		"allowNull": false
	})
		studentNumber!: string

	@ForeignKey(() => User)
	@Column({
		"allowNull": false
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User
}
