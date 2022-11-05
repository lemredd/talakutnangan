import GetList from "!%/api/comment/list.get"
import PostCreate from "!%/api/comment/create.post"
import PatchRestore from "!%/api/comment/restore.patch"
import GetCountVotes from "!%/api/comment/count_votes.get"
import DeleteArchive from "!%/api/comment/archive.delete"
import PatchUpdate from "!%/api/comment/update(id).patch"

export const controllers = [
	GetList,
	PostCreate,
	DeleteArchive,
	PatchUpdate,
	PatchRestore,
	GetCountVotes
]
