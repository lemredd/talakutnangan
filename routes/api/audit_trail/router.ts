import Router from "!/bases/router"
import GetList from "!%/api/department/list.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList()
			])
		}))
	}
}
