import {
	Table,
	Model,
	Column,
	DataType,
	AllowNull
} from "sequelize-typescript"

@Table({
	timestamps: true,
	paranoid: true
})
export default class extends Model {
	@AllowNull
	@Column({
		type: DataType.BLOB("medium"),
		defaultValue: null
	})
	fileContents!: Buffer|null
}
