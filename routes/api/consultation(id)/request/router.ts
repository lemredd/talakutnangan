import Router from "!/bases/router"
import GetRequestAsPDF from "!%/api/consultation(id)/request/as_pdf.get"
import PostRequestAsPDF from "!%/api/consultation(id)/request/as_pdf.post"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetRequestAsPDF(),
				new PostRequestAsPDF()
			])
		}))
	}
}
