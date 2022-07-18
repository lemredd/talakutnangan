export type User = {
	id: number
	email: string
	name: string
	role?: string
	jobTitle?: string
}

export type Department = {
	id: number
	name: string
	users: number
}

export type ManagerKind = "secretary" | "dean" | "service" | "admin"
