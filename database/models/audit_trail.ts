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
export default class Signature extends Model {
	@AllowNull
	@ForeignKey(() => User)
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
