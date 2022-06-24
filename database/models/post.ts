import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	AllowNull,
	ForeignKey,
	BelongsToMany
} from "sequelize-typescript"
import User from "%/models/user"
import Role from "%/models/role"


@Table({
	timestamps: true,
	paranoid: true
})
//id, user id, role id, title, desc, bad word
export default class Post extends Model {

	@Column({
		unique: true,
		allowNull: false
	})
    title!: string

	@Column({
		unique: true,
		allowNull: false
	})
    desc!: string

	@Column({
		unique: true,
		allowNull: false
	})
    badWordExist!: boolean

	@ForeignKey(() => User)
	@Column({
		allowNull: false,
		type: DataType.BIGINT
	})
	userID!: number

	@BelongsTo(() => User)
	user!: User

	@ForeignKey(() => Role)
	@Column({
		allowNull: false,
		type: DataType.BIGINT
	})
	roleID!: number

	@BelongsTo(() => Role)
	role!: Role
}