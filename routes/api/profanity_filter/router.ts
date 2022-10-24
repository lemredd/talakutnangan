import GetList from "!%/api/profanity_filter/list.get"
import PostCreate from "!%/api/profanity_filter/create.post"
import PatchRestore from "!%/api/profanity_filter/restore.patch"
import PatchUpdate from "!%/api/profanity_filter/update(id).patch"
import DeleteArchive from "!%/api/profanity_filter/archive.delete"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	PatchRestore,
	DeleteArchive
]
