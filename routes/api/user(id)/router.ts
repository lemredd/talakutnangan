import Router from "!/bases/router"
import RelationshipRouter, { controllers as relationshipControllers }
	from "!%/api/user(id)/relationships/router"
import PatchUpdatePassword from "!%/api/user(id)/update_password.patch"

export const controllers = [
	PatchUpdatePassword,
	...relationshipControllers
]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new PatchUpdatePassword()
			])
		}))

		this.useRoutersAsync(new Promise(resolve => {
			resolve([
				new RelationshipRouter()
			])
		}))
	}
}
