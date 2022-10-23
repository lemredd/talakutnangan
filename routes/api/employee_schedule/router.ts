import Router from "!/bases/router"
import GetList from "!%/api/employee_schedule/list.get"
import PostCreate from "!%/api/employee_schedule/create.post"
import PatchUpdate from "!%/api/employee_schedule/update(id).patch"
import DeleteArchive from "!%/api/employee_schedule/archive.delete"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	DeleteArchive
]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(instantiateSimultaneously([
			GetList,
			PostCreate,
			PatchUpdate,
			DeleteArchive
		]))
	}
}
