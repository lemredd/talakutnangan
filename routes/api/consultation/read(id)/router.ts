import Router from "!/bases/router"
import GetReadAsPDF from "!%/api/consultation/read(id)/as_pdf.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetReadAsPDF()
			])
		}))
	}
}
