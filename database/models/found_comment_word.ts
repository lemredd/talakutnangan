import {
	Model,
	Table,
	Column,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import Comment from "%/models/comment"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class FoundCommentWord extends Model {
	@ForeignKey(() => Comment)
	@Column({
		"allowNull": false
	})
		commentID!: number

	@BelongsTo(() => Comment)
		comment!: Comment
}
