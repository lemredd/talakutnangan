import Router from "!/bases/router"
import GetList from "!%/enhancer/user/list.get"
import GetImport from "!%/enhancer/user/import.get"
import GetLogIn from "!%/enhancer/user/log_in.get"
import GetVerify from "!%/enhancer/user/verify(data).get"
import GetStudentsList from "!%/enhancer/user/students_list.get"
import GetEmployeeList from "!%/enhancer/user/employees_list.get"
import GetInstituteUsersList from "!%/enhancer/user/institute_users.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new GetLogIn(),
			new GetImport(),
			new GetVerify(),
			new GetStudentsList(),
			new GetEmployeeList(),
			new GetInstituteUsersList()
		])
	}
}
