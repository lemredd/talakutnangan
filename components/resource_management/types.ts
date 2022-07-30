// TODO: Types are incomplete or inaccurate. Will change soon

export type User = {
	id: number
	email: string
	name: string
	roles?: {
		[key:string]: any
	}
	jobTitle?: string
}

export type Department = {
	id: number
	name: string
	users: number
}

export type Role = {
	id: number
	name: string
	users: number
}

export type ManagerKind = "secretary" | "dean" | "service" | "admin"
