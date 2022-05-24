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
		type: "timestamp",
		nullable: true
	})
	admittedAt: Date|null

	@Column({
		type: "timestamp",
		nullable: true
	})
	emailVerifiedAt: Date|null
}
