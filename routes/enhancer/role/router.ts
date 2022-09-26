import Router from "!/bases/router"
import GetIndex from "!%/enhancer/role/index.get"
import GetRead from "!%/enhancer/role/read(id).get"
import GetCreate from "!%/enhancer/role/create.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetIndex(),
			new GetRead(),
			new GetCreate()
		])
	}
}
