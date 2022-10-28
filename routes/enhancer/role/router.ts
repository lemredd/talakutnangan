import GetList from "!%/enhancer/role/list.get"
import GetIndex from "!%/enhancer/role/index.get"
import GetRead from "!%/enhancer/role/read(id).get"
import GetCreate from "!%/enhancer/role/create.get"

export const controllers = [
	GetIndex,
	GetList,
	GetCreate,
	GetRead
]
