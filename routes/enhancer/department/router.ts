import Router from "!/bases/router"
import GetList from "!%/enhancer/department/list.get"
import GetCreate from "!%/enhancer/department/create.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new GetCreate()
		])
	}
}
