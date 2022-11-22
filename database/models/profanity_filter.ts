import {
	Table,
	Model,
	Column,
	HasMany,
	BelongsToMany
} from "sequelize-typescript"
import Post from "%/models/post"
import Comment from "%/models/comment"
import FoundPostWord from "%/models/found_post_word"
import FoundCommentWord from "%/models/found_comment_word"

@Table({
	"timestamps": true,
	"paranoid": true
})
export default class ProfanityFilter extends Model {
	@Column({
		"unique": true,
		"allowNull": false
	})
		word!: string

	@HasMany(() => FoundPostWord)
		foundPostWords!: FoundPostWord[]

	@BelongsToMany(() => Post, () => FoundPostWord)
		post!: Post[]

	@HasMany(() => FoundCommentWord)
		foundCommentWords!: FoundCommentWord[]

	@BelongsToMany(() => Comment, () => FoundCommentWord)
		comment!: Comment[]
}
