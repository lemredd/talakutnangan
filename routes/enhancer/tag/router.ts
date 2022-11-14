import GetList from "!%/enhancer/tag/list.get"
import GetIndex from "!%/enhancer/tag/index.get"
import GetRead from "!%/enhancer/tag/read(id).get"
import GetCreate from "!%/enhancer/tag/create.get"

export const controllers = [
	GetIndex,
	GetList,
	GetCreate,
	GetRead
]
