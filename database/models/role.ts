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
	department_flags!: number

	@Column({
		allowNull: false
	})
	role_flags!: number

	@Column({
		allowNull: false
	})
	semester_flags!: number

	@Column({
		allowNull: false
	})
	tag_flags!: number

	@Column({
		allowNull: false
	})
	post_flags!: number

	@Column({
		allowNull: false
	})
	comment_flags!: number

	@Column({
		allowNull: false
	})
	profanity_flags!: number

	@Column({
		allowNull: false
	})
	user_flags!: number

	@Column({
		allowNull: false
	})
	audit_trail_flags!: number
}
