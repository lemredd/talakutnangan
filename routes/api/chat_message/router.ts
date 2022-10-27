import GetList from "!%/api/chat_message/list.get"
import PostCreate from "!%/api/chat_message/create.post"
import PatchRestore from "!%/api/chat_message/restore.patch"
import DeleteArchive from "!%/api/chat_message/archive.delete"
import PatchUpdate from "!%/api/chat_message/update(id).patch"
import PostCreateWithFile from "!%/api/chat_message/create_with_file.post"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	PatchRestore,
	DeleteArchive,
	PostCreateWithFile
]
