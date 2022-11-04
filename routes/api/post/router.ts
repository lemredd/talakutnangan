import GetList from "!%/api/post/list.get"
import PostCreate from "!%/api/post/create.post"
import PatchRestore from "!%/api/post/restore.patch"
import DeleteArchive from "!%/api/post/archive.delete"
import PatchUpdate from "!%/api/post/update(id).patch"

export const controllers = [
	GetList,
	PostCreate,
	DeleteArchive,
	PatchUpdate,
	PatchRestore
]
