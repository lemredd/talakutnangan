import Router from "!/bases/router"
import GetVerify from "!%/user/verify(data).get"
import GetEmployeeList from "!%/user/employee_list.get"

export default class extends Router {

	constructor() {
		super()

		this.useControllers([
			new GetVerify(),
			new GetEmployeeList()
		])
	}
}
