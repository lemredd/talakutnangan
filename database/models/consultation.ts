import {
	Table,
	Model,
	Column,
	HasMany,
	DataType,
	AllowNull,
	BelongsTo,
	ForeignKey,
	BelongsToMany
} from "sequelize-typescript"
import { Status, StatusValues } from "$/types/database"

import User from "%/models/user"
import Role from "%/models/role"
import Consulter from "%/models/consulter"
import ChatMessage from "%/models/chat_message"
import AttachedRole from "%/models/attached_role"
import ChatMessageActivity from "%/models/chat_message_activity"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class Consultation extends Model {
	@Column({
		"allowNull": false,
		"type": DataType.TEXT
	})
		reason!: string

	@Column({
		"allowNull": false,
		"type": DataType.ENUM(
			...StatusValues
		)
	})
		status!: Status

	@Column({
		"allowNull": false,
		"type": DataType.TEXT
	})
		actionTaken!: string

	@Column({
		"allowNull": false,
		"type": DataType.DATE
	})
		scheduledStartAt!: Date

	@AllowNull
	@Column({
		"defaultValue": null,
		"type": DataType.DATE
	})
		startedAt!: Date|null

	@AllowNull
	@Column({
		"defaultValue": null,
		"type": DataType.DATE
	})
		finishedAt!: Date|null

	@ForeignKey(() => AttachedRole)
	@Column({
		"allowNull": false
	})
		attachedRoleID!: number

	@BelongsTo(() => AttachedRole)
		consultantInfo?: AttachedRole

	@BelongsToMany(() => User, () => Consulter)
		consulters!: User[]

	get consultant(): User|null { return this.consultantInfo?.user ?? null }

	get consultantRole(): Role|null { return this.consultantInfo?.role ?? null }

	@HasMany(() => ChatMessageActivity)
		chatMessageActivities?: ChatMessageActivity[]

	@BelongsToMany(() => ChatMessage, () => ChatMessageActivity)
		chatMessages?: ChatMessage[]
}
