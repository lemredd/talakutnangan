import GetList from "!%/api/semester/list.get"
import PostCreate from "!%/api/semester/create.post"
import DeleteArchive from "!%/api/semester/archive.delete"
import PatchUpdate from "!%/api/semester/update(id).patch"
import PatchRestore from "!%/api/semester/restore.patch"

export const controllers = [
	GetList,
	PostCreate,
	DeleteArchive,
	PatchUpdate,
	PatchRestore
]
