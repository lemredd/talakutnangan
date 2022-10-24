import GetList from "!%/api/role/list.get"
import GetRead from "!%/api/role/read(id).get"
import PostCreate from "!%/api/role/create.post"
import PatchRestore from "!%/api/role/restore.patch"
import PatchUpdate from "!%/api/role/update(id).patch"
import DeleteArchive from "!%/api/role/archive.delete"
import GetCountUsers from "!%/api/role/count_users.get"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

export const controllers = [
	GetList,
	// ! this should match first to prevent shadowing by `read(id)` route
	GetCountUsers,
	GetRead,
	PostCreate,
	PatchUpdate,
	PatchRestore,
	DeleteArchive
]
