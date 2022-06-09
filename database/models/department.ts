import { Table, Model, Column, HasMany, NotNull } from "sequelize-typescript"
import User from "%/models/user"

@Table({
	timestamps: true,
	paranoid: true
})
export default class Department extends Model {
	@Column({
		allowNull: false
	})
	acronym: string

	@Column({
		unique: true,
		allowNull: false
	})
	fullName: string

	@Column({
		allowNull: false
	})
	mayAdmit: boolean

	@HasMany(() => User)
	users: User[]
}
