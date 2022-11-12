import GetList from "!%/api/user/list.get"
import GetRead from "!%/api/user/read(id).get"
import PostLogIn from "!%/api/user/log_in.post"
import PostImport from "!%/api/user/import.post"
import PostLogOut from "!%/api/user/log_out.post"
import PatchUpdate from "!%/api/user/update(id).patch"
import DeleteArchive from "!%/api/user/archive.delete"
import PatchResetPassword from "!%/api/user/reset_password(id).patch"

export const controllers = [
	GetList,
	GetRead,
	PostLogIn,
	PostImport,
	PostLogOut,
	PatchUpdate,
	DeleteArchive,
	PatchResetPassword
]
