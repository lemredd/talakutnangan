import GetList from "!%/api/employee_schedule/list.get"
import PostCreate from "!%/api/employee_schedule/create.post"
import PatchUpdate from "!%/api/employee_schedule/update(id).patch"
import DeleteArchive from "!%/api/employee_schedule/archive.delete"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	DeleteArchive
]
