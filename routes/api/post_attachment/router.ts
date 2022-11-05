import GetRead from "!%/api/post_attachment/read(id).get"
import PostCreate from "!%/api/post_attachment/create.post"
import DeleteArchive from "!%/api/post_attachment/archive.delete"

export const controllers = [
	GetRead,
	PostCreate,
	DeleteArchive
]
