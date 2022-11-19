import {
	Table,
	Column,
	HasMany,
	DataType,
	BelongsTo,
	ForeignKey,
	BelongsToMany
} from "sequelize-typescript"

import Tag from "%/models/tag"
import User from "%/models/user"
import Role from "%/models/role"
import Comment from "%/models/comment"
import PostTag from "%/models/post_tag"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import PostAttachment from "%/models/post_attachment"
import TextContentLike from "%/models/text_content-like"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class Post extends TextContentLike {
	@ForeignKey(() => AttachedRole)
	@Column({
		"allowNull": false
	})
		attachedRoleID!: number

	@BelongsTo(() => AttachedRole)
		posterInfo?: AttachedRole

	@ForeignKey(() => Department)
	@Column({
		"allowNull": true,
		"defaultValue": null,
		"type": DataType.BIGINT
	})
		departmentID!: number|null

	@BelongsTo(() => Department)
		department!: Department|null

	get poster(): User|undefined { return this.posterInfo?.user }

	get posterRole(): Role|undefined { return this.posterInfo?.role }

	@HasMany(() => Comment)
		comments?: Comment[]

	@HasMany(() => PostAttachment)
		postAttachments!: PostAttachment[]

	@BelongsToMany(() => Tag, () => PostTag)
		tags!: Tag[]
}
