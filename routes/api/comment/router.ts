import PostCreate from "!%/api/comment/create.post"
import DeleteArchive from "!%/api/comment/archive.delete"
import PatchUpdate from "!%/api/comment/update(id).patch"
import PatchRestore from "!%/api/comment/restore.patch"

export const controllers = [
	PostCreate,
	DeleteArchive,
	PatchUpdate,
	PatchRestore
]
