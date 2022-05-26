import Router from "!/helpers/router"
import APIRouter from "!/routes/api/router"
import ChatRouter from "!/routes/chat/router"

export default class extends Router {
	constructor() {
		super("/")

		this.useRouter(new ChatRouter())
		this.useRouter(new APIRouter())
	}
}
