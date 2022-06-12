import {
	Table,
	Model,
	Column
} from "sequelize-typescript"

@Table({
	timestamps: true,
	paranoid: true
})
export default class User extends Model {
	@Column({
		unique: true,
		allowNull: false
	})
	name!: string

	@Column({
		allowNull: false
	})
	departmentFlags!: number

	@Column({
		allowNull: false
	})
	roleFlags!: number

	@Column({
		allowNull: false
	})
	semesterFlags!: number

	@Column({
		allowNull: false
	})
	tagFlags!: number

	@Column({
		allowNull: false
	})
	postFlags!: number

	@Column({
		allowNull: false
	})
	commentFlags!: number

	@Column({
		allowNull: false
	})
	profanityFlags!: number

	@Column({
		allowNull: false
	})
	userFlags!: number

	@Column({
		allowNull: false
	})
	auditTrailFlags!: number
}
