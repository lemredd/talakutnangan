import {
	Table,
	Model,
	Column,
	HasMany,
	BelongsToMany
} from "sequelize-typescript"
import User from "%/models/user"
import AttachedRole from "%/models/attached_role"

@Table({
	"timestamps": true,
	"paranoid": true
})
export default class Role extends Model {
	@Column({
		"unique": true,
		"allowNull": false
	})
		name!: string

	@Column({
		"allowNull": false
	})
		departmentFlags!: number

	@Column({
		"allowNull": false
	})
		roleFlags!: number

	@Column({
		"allowNull": false
	})
		semesterFlags!: number

	@Column({
		"allowNull": false
	})
		tagFlags!: number

	@Column({
		"allowNull": false
	})
		postFlags!: number

	@Column({
		"allowNull": false
	})
		commentFlags!: number

	@Column({
		"allowNull": false
	})
		profanityFlags!: number

	@Column({
		"allowNull": false
	})
		userFlags!: number

	@Column({
		"allowNull": false
	})
		auditTrailFlags!: number

	@HasMany(() => AttachedRole)
		attachedRoles!: AttachedRole[]

	@BelongsToMany(() => User, () => AttachedRole)
		users!: User[]

	// UserCount?:number
}
