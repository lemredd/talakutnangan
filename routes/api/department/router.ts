import Router from "!/bases/router"
import GetList from "!%/api/department/list.get"
import PostCreate from "!%/api/department/create.post"
import PatchRestore from "!%/api/department/restore.patch"
import PatchUpdate from "!%/api/department/update(id).patch"
import DeleteArchive from "!%/api/department/archive.delete"
import GetCountUsers from "!%/api/department/count_users.get"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	PatchRestore,
	DeleteArchive,
	GetCountUsers
]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(instantiateSimultaneously([
			GetList,
			PostCreate,
			PatchUpdate,
			PatchRestore,
			DeleteArchive,
			GetCountUsers
		]))
	}
}
