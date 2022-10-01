import {
	Model,
	Column,
	DataType
} from "sequelize-typescript"

export default abstract class extends Model {
	@Column({
		"type": DataType.BLOB("medium")
	})
		fileContents!: Buffer
}
