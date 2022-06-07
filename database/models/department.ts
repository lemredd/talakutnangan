import { Table, Model, Column, DataType, AllowNull } from "sequelize-typescript"

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
}
