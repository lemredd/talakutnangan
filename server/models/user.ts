import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { UserKind } from "!/types"

@Entity()
export default class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		unique: true
	})
	email: string

	@Column()
	password: string

	@Column({
		nullable: true
	})
	admittedAt: Date|null

	@Column({
		type: "enum",
		enum: UserKind
	})
	kind: UserKind

	@Column({
		nullable: true
	})
	emailVerifiedAt: Date|null
}
