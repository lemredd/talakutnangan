import {
	Table,
	Model,
	Column,
	HasMany,
	BelongsToMany
} from "sequelize-typescript"
import Post from "%/models/post"
import PostTag from "%/models/post_tag"

@Table({
	"timestamps": true,
	"paranoid": true
})
export default class Tag extends Model {
	@Column({
		"unique": true,
		"allowNull": false
	})
		name!: string

	@HasMany(() => PostTag)
		postTags!: PostTag[]

	@BelongsToMany(() => Post, () => PostTag)
		post!: Post[]
}
