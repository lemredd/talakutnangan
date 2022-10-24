import Router from "!/bases/router"
import GetList from "!%/enhancer/user/list.get"
import GetImport from "!%/enhancer/user/import.get"
import GetLogIn from "!%/enhancer/user/log_in.get"
import GetVerify from "!%/enhancer/user/verify(data).get"

export const controllers = [
	GetList,
	GetLogIn,
	GetImport,
	GetVerify
]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new GetLogIn(),
				new GetImport(),
				new GetVerify()
			])
		}))
	}
}
