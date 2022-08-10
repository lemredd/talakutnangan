import {
	Table,
	Model,
	Column,
	BelongsTo,
	ForeignKey,
	DataType,
	AllowNull
} from "sequelize-typescript"

import type { GeneralObject } from "$/types/general"
import User from "%/models/user"

@Table({
	timestamps: true,
	paranoid: true
})
export default class AuditTrail extends Model {
	@AllowNull
	@ForeignKey(() => User)
	@Column({
		type: DataType.BIGINT
	})
	userID!: number|null

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	actionName!: string

	@Column({
		type: DataType.JSON,
		allowNull: false
	})
	extra!: GeneralObject

	@BelongsTo(() => User)
	user!: User|null
}
