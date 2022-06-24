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
import AttachedRole from "%/models/attached_role"


@Table({
	timestamps: true,
	paranoid: true
})
//id, user, title, desc, badWordExist, voters, downVoters, voteCount, isMenuShown, isEditShown, isPostShown, createdAt, updatedAt, deletedAt
export default class Post extends Model {
    @Column({
		unique: true,
		allowNull: false
	})
    user!: string

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

	@Column({
		unique: true,
		allowNull: false
	})
    voters!: []

	@Column({
		unique: true,
		allowNull: false
	})
    downVoters!: []

	@Column({
		unique: true,
		allowNull: false
	})
    voteCount!: number

	@Column({
		unique: true,
		allowNull: false
	})
    isMenuShown!: boolean

	@Column({
		unique: true,
		allowNull: false
	})
    isEditPost!: boolean

	@Column({
		unique: true,
		allowNull: false
	})
    isPostShown!: boolean

	@BelongsTo(() => User)
	users!: User[]
}