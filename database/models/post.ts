import {
	Table,
	Column,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import User from "%/models/user"
import Role from "%/models/role"
import AttachedRole from "%/models/attached_role"
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

	get poster(): User|undefined { return this.posterInfo?.user }

	get posterRole(): Role|undefined { return this.posterInfo?.role }
}
