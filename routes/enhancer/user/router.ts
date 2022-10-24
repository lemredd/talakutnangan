import GetList from "!%/enhancer/user/list.get"
import GetRead from "!%/enhancer/user/read(id).get"
import GetImport from "!%/enhancer/user/import.get"
import GetLogIn from "!%/enhancer/user/log_in.get"
import GetVerify from "!%/enhancer/user/verify(data).get"

export const controllers = [
	GetList,
	GetRead,
	GetLogIn,
	GetImport,
	GetVerify
]
