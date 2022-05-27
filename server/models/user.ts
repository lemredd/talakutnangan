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
		name: "kind",
		enum: UserKind
	})
	rawKind: string

	@Column({
		nullable: true
	})
	emailVerifiedAt: Date|null

	get kind(): UserKind {
		return this.rawKind as UserKind
	}
}
