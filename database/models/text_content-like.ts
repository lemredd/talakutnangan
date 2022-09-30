import {
	Model,
	Column,
	DataType
} from "sequelize-typescript"

export default abstract class extends Model {
	@Column({
		"allowNull": false,
		"type": DataType.TEXT
	})
		content!: string

	@Column({
		"defaultValue": null,
		"type": DataType.DATE
	})
		approvedAt!: Date|null
}
