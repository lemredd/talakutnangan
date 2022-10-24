import GetList from "!%/api/tag/list.get"
import PostCreate from "!%/api/tag/create.post"
import PatchRestore from "!%/api/tag/restore.patch"
import PatchUpdate from "!%/api/tag/update(id).patch"
import DeleteArchive from "!%/api/tag/archive.delete"

export const controllers = [
	GetList,
	PostCreate,
	PatchRestore,
	PatchUpdate,
	DeleteArchive
]
