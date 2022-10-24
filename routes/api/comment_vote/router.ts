import GetList from "!%/api/comment_vote/list.get"
import PostCreate from "!%/api/comment_vote/create.post"
import DeleteArchive from "!%/api/comment_vote/archive.delete"
import PatchUpdate from "!%/api/comment_vote/update(id).patch"
import PatchRestore from "!%/api/comment_vote/restore.patch"

export const controllers = [
	GetList,
	PostCreate,
	DeleteArchive,
	PatchUpdate,
	PatchRestore
]
