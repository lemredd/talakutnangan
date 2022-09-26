import Router from "!/bases/router"
import GetIndex from "!%/enhancer/department/index.get"
import GetCreate from "!%/enhancer/department/create.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetIndex(),
			new GetCreate()
		])
	}
}
