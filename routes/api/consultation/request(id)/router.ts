import Router from "!/bases/router"
import PostReadAsPDF from "!%/api/consultation/request(id)/as_pdf.post"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new PostReadAsPDF()
			])
		}))
	}
}
