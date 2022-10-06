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
import Role from "%/models/role"
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
		"type": DataType.STRING
	})
		reason!: string

	@Column({
		"allowNull": true,
		"defaultValue": null,
		"type": DataType.TEXT
	})
		actionTaken!: string|null

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

	get consultant(): User|undefined { return this.consultantInfo?.user }

	get consultantRole(): Role|undefined { return this.consultantInfo?.role }

	@HasMany(() => ChatMessageActivity)
		chatMessageActivities?: ChatMessageActivity[]

	get chatMessages(): ChatMessage[]|undefined {
		let chatMessages: ChatMessage[] = []

		if (this.chatMessageActivities) {
			chatMessages = this.chatMessageActivities.reduce(
				(previousMessages, chatMessageActivity) => {
					const messages = chatMessageActivity.chatMessages

					if (messages) {
						return [
							...previousMessages,
							...messages.map(message => {
								message.chatMessageActivity = chatMessageActivity
								return message
							})
						]
					}

					return previousMessages
				},
				[] as ChatMessage[]
			)
		}

		// eslint-disable-next-line no-undefined
		if (chatMessages.length === 0) return undefined

		return chatMessages
	}
}
