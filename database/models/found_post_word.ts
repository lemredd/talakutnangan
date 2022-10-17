import {
	Model,
	Table,
	Column,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import ProfanityFilter from "%/models/profanity_filter"
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

	@ForeignKey(() => ProfanityFilter)
	@Column({
		"allowNull": false
	})
		profanityFilterID!: number

	@BelongsTo(() => ProfanityFilter)
		profanityFilter!: ProfanityFilter
}
