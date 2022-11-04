import GetList from "!%/api/post/list.get"
import PostCreate from "!%/api/post/create.post"
import PatchRestore from "!%/api/post/restore.patch"
import DeleteArchive from "!%/api/post/archive.delete"
import PatchUpdate from "!%/api/post/update(id).patch"
import GetCountComments from "!%/api/post/count_comments.get"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	PatchRestore,
	DeleteArchive,
	GetCountComments
]
