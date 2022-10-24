import GetList from "!%/api/department/list.get"
import PostCreate from "!%/api/post/create.post"
import DeleteArchive from "!%/api/post/archive.delete"
import PatchUpdate from "!%/api/post/update(id).patch"
import PatchRestore from "!%/api/post/restore.patch"

export const controllers = [
	GetList,
	PostCreate,
	DeleteArchive,
	PatchUpdate,
	PatchRestore
]
