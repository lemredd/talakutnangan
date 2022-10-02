import {
	Table,
	Column,
	DataType,
	AllowNull,
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

	@BelongsTo(() => User)
		post!: Post

	@AllowNull
	@ForeignKey(() => Comment)
	@Column({
		"type": DataType.BIGINT
	})
		commentID?: number|null

	@BelongsTo(() => Comment)
		// eslint-disable-next-line no-use-before-define
		comment?: Comment|null
}
