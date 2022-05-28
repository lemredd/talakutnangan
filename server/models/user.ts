import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

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

	@Column()
	kind: string

	@Column({
		nullable: true
	})
	emailVerifiedAt: Date|null

	@Column({
		nullable: true
	})
	signature: Buffer|null
}
