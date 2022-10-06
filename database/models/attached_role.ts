import {
	Table,
	Model,
	Column,
	BelongsTo,
	DataType,
	HasMany,
	ForeignKey
} from "sequelize-typescript"
import User from "%/models/user"
import Role from "%/models/role"
import Post from "%/models/post"
import Consultation from "%/models/consultation"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class AttachedRole extends Model {
	@Column({
		"allowNull": false,
		"autoIncrement": true,
		"primaryKey": true,
		"type": DataType.BIGINT
	})
		id!: number

	@ForeignKey(() => User)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User

	@ForeignKey(() => Role)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		roleID!: number

	@BelongsTo(() => Role)
		role!: Role

	@HasMany(() => Consultation)
		consultation!: Consultation

	@HasMany(() => Post)
		posts!: Post
}
