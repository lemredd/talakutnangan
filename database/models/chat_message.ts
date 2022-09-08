import {
	Table,
	Model,
	Column,
	HasOne,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"

import type { GeneralObject } from "$/types/general"

import User from "%/models/user"
import Consultation from "%/models/consultation"
import AttachedChatFile from "%/models/attached_chat_file"
import ChatMessageActivity from "%/models/chat_message_activity"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class ChatMessage extends Model {
	@Column({
		"allowNull": false,
		"type": DataType.STRING
	})
		kind!: string

	@Column({
		"allowNull": false,
		"type": DataType.JSON
	})
		data!: GeneralObject

	@ForeignKey(() => ChatMessageActivity)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		chatMessageActivityID!: number

	@BelongsTo(() => ChatMessageActivity)
		chatMessageActivity?: ChatMessageActivity

	get user(): User|undefined { return this.chatMessageActivity?.user }

	get consultation(): Consultation|undefined { return this.chatMessageActivity?.consultation }

	@HasOne(() => AttachedChatFile)
		attachedChatFile?: AttachedChatFile
}
