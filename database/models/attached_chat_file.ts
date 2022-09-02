import {
	Table,
	Column,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"
import FileLike from "%/models/file-like"
import ChatMessage from "%/models/chat_message"

@Table({
	"paranoid": false,
	"timestamps": true
})
export default class AttachedChatFile extends FileLike {
	@ForeignKey(() => ChatMessage)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		chatMessageID!: number

	@BelongsTo(() => ChatMessage)
		chatMessage!: ChatMessage
}
