import {
	Model,
	Table,
	Column,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import Tag from "%/models/tag"
import Post from "%/models/post"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class PostTag extends Model {
	@ForeignKey(() => Post)
	@Column({
		"allowNull": false
	})
		postID!: number

	@BelongsTo(() => Post)
		post!: Post

	@ForeignKey(() => Tag)
	@Column({
		"allowNull": false
	})
		tagID!: number

	@BelongsTo(() => Tag)
		tag!: Tag
}
