export type User = {
	id: number
	email: string
	name: string
	role: string
}

export type ManagerKind = "secretary" | "dean" | "service" | "admin"