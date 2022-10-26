import {
	Table,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import User from "%/models/user"
import Post from "%/models/post"
import TextContentLike from "%/models/text_content-like"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class Comment extends TextContentLike {
	@ForeignKey(() => User)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User

	@ForeignKey(() => Post)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		postID!: number

	@BelongsTo(() => Post)
		post!: Post
}
