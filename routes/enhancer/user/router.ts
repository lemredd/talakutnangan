import GetList from "!%/enhancer/user/list.get"
import GetIndex from "!%/enhancer/user/index.get"
import GetLogIn from "!%/enhancer/user/log_in.get"
import GetRead from "!%/enhancer/user/read(id).get"
import GetImport from "!%/enhancer/user/import.get"
import GetVerify from "!%/enhancer/user/verify(data).get"

export const controllers = [
	GetIndex,
	GetList,
	GetRead,
	GetLogIn,
	GetImport,
	GetVerify
]
