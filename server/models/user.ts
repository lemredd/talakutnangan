import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import getDateType from "!/data_source/get_date_type"

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
		nullable: true
	})
	emailVerifiedAt: Date|null
}
