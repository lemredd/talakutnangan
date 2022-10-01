import {
	Table,
	Column,
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
		"allowNull": false
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User

	@ForeignKey(() => Post)
	@Column({
		"allowNull": false
	})
		postID!: number

	@BelongsTo(() => User)
		post!: Post

	@ForeignKey(() => Comment)
	@Column({
		"allowNull": true
	})
		commentID?: number

	@BelongsTo(() => User)
		// eslint-disable-next-line no-use-before-define
		comment?: Comment
}
