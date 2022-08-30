import {
	Table,
	Model,
	Column,
	HasMany,
	DataType,
	AllowNull,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"
import User from "%/models/user"
import ChatMessage from "%/models/chat_message"
import Consultation from "%/models/consultation"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class ChatMessageActivity extends Model {
	@Column({
		"allowNull": false,
		"type": DataType.DATE
	})
		receivedMessageAt!: Date|null

	@AllowNull
	@Column({
		"defaultValue": null,
		"type": DataType.DATE
	})
		seenMessageAt!: Date|null

	@ForeignKey(() => User)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		userID!: number

	@BelongsTo(() => User)
		user!: User

	@ForeignKey(() => Consultation)
	@Column({
		"allowNull": false,
		"type": DataType.BIGINT
	})
		consultationID!: number

	@BelongsTo(() => Consultation)
		consultation!: Consultation

	@HasMany(() => ChatMessage)
		chatMessages?: ChatMessage[]
}
