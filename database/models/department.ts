import { Table, Model, Column, HasMany } from "sequelize-typescript"
import User from "%/models/user"

@Table({
	timestamps: true,
	paranoid: true
})
export default class Department extends Model {
	@Column
	acronym: string

	@Column
	fullName: string

	@Column
	mayAdmit: boolean

	@HasMany(() => User)
	users: User[]
}
