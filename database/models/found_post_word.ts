import {
	Model,
	Table,
	Column,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import Post from "%/models/post"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class FoundPostWord extends Model {
	@ForeignKey(() => Post)
	@Column({
		"allowNull": false
	})
		postID!: number

	@BelongsTo(() => Post)
		post!: Post
}
