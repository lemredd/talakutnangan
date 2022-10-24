import GetList from "!%/api/chat_message_activity/list.get"
import PatchRestore from "!%/api/chat_message_activity/restore.patch"
import PatchUpdate from "!%/api/chat_message_activity/update(id).patch"
import DeleteArchive from "!%/api/chat_message_activity/archive.delete"

export const controllers = [
	GetList,
	PatchUpdate,
	PatchRestore,
	DeleteArchive
]
