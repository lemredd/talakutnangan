import { Table, Model, Column, HasMany } from "sequelize-typescript"
import User from "%/models/user"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class Department extends Model {
	@Column({
		"allowNull": false
	})
		acronym!: string

	@Column({
		"allowNull": false,
		"unique": true
	})
		fullName!: string

	@Column({
		"allowNull": false
	})
		mayAdmit!: boolean

	@HasMany(() => User)
		users!: User[]
}
