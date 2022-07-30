import type { ManagerKind } from './types'


export default class {
	readonly kind: string = ""

	constructor(kind: ManagerKind) {
		this.kind = kind
	}

	isInstituteLimited(): boolean {
		return this.kind === "secretary" || this.kind === "dean"
	}

	isStudentServiceLimited(): boolean {
		return this.kind === "service"
	}

	isAdmin(): boolean {
		return this.kind === "admin"
	}
}
