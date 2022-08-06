import {
	Table,
	Model,
	Column,
	DataType,
	AllowNull
} from "sequelize-typescript"

export default abstract class extends Model {
	@AllowNull
	@Column({
		type: DataType.BLOB("medium"),
		defaultValue: null
	})
	fileContents!: Buffer|null
}
