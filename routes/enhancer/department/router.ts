import GetList from "!%/enhancer/department/list.get"
import GetIndex from "!%/enhancer/department/index.get"
import GetRead from "!%/enhancer/department/read(id).get"
import GetCreate from "!%/enhancer/department/create.get"

export const controllers = [
	GetIndex,
	GetList,
	GetCreate,
	GetRead
]
