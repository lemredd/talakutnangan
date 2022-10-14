import {
	Model,
	Column,
	DataType
} from "sequelize-typescript"

// ! If something changes to this file, also change `%/models/asynchronous_file`.
export default abstract class extends Model {
	@Column({
		"type": DataType.BLOB("medium")
	})
		fileContents!: Buffer
}
