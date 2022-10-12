import {
	Table,
	Model,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import User from "%/models/user"
import Comment from "%/models/comment"
import { VoteKind, VoteKindValues } from "$/types/database"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class CommentVote extends Model {
	@ForeignKey(() => Comment)
	@Column({
		"allowNull": true,
		"defaultValue": null,
		"type": DataType.BIGINT
	})
		commentID!: number|null

	@BelongsTo(() => Comment)
		comment!: Comment

	@ForeignKey(() => User)
	@Column({
		"allowNull": false
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User

	@Column({
		"allowNull": false,
		"type": DataType.ENUM(
			...VoteKindValues
		)
	})
		kind!: VoteKind
}
