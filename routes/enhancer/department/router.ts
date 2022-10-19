import Router from "!/bases/router"
import GetList from "!%/enhancer/department/list.get"
import GetRead from "!%/enhancer/department/read(id).get"
import GetCreate from "!%/enhancer/department/create.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new GetCreate(),
				new GetRead()
			])
		}))
	}
}
