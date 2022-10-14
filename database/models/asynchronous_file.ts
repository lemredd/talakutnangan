import {
	Table,
	Column,
	DataType,
	AllowNull
} from "sequelize-typescript"

import AsynchronousLike from "%/models/asynchronous-like"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class AsynchronousFile extends AsynchronousLike {
	@AllowNull
	@Column({
		"type": DataType.BLOB("medium")
	})
		fileContents!: Buffer|null
}
