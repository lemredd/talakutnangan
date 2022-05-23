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
	admitted_at: Date|null

	@Column({
		nullable: true
	})
	email_verified_at: Date|null
}
