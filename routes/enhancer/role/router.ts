import Router from "!/bases/router"
import GetList from "!%/enhancer/role/list.get"
import GetRead from "!%/enhancer/role/read(id).get"
import GetCreate from "!%/enhancer/role/create.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new GetRead(),
			new GetCreate()
		])
	}
}
