import Router from "!/bases/router"
import GetVerify from "!%/user/verify(data).get"
import GetStudentsList from "!%/user/students_list.get"
import GetEmployeeList from "!%/user/employees_list.get"
import GetInstituteUsersList from "!%/user/institute_users.get"

export default class extends Router {

	constructor() {
		super()

		this.useControllers([
			new GetVerify(),
			new GetStudentsList(),
			new GetEmployeeList(),
			new GetInstituteUsersList()
		])
	}
}
