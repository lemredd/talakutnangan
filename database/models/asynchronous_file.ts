import {
	Table,
	Column,
	DataType
} from "sequelize-typescript"

import AsynchronousLike from "%/models/asynchronous-like"

@Table({
	"paranoid": true,
	"timestamps": true
})
export default class AsynchronousFile extends AsynchronousLike {
	@Column({
		"type": DataType.BLOB("medium")
	})
		fileContents!: Buffer
}
