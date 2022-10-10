import {
	Table,
	Column,
	DataType,
	AllowNull,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import Post from "%/models/post"
import FileLike from "%/models/file-like"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class PostAttachment extends FileLike {
	@ForeignKey(() => Post)
	@AllowNull
	@Column({
		"defaultValue": null,
		"type": DataType.BIGINT
	})
		postID!: number|null

	@BelongsTo(() => Post)
		post!: Post|null

	@Column({
		"allowNull": false
	})
		fileType!: string
}
