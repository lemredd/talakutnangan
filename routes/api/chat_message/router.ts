import PostCreate from "!%/api/chat_message/create.post"
import PatchUpdate from "!%/api/chat_message/update(id).patch"
import PostCreateWithFile from "!%/api/chat_message/create_with_file.post"

export const controllers = [
	PostCreate,
	PatchUpdate,
	PostCreateWithFile
]
