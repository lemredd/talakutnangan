import Router from "!/helpers/router"
import APIRouter from "!/routes/api/router"
import ChatRouter from "!/routes/chat/router"
import DevRouter from "!/routes/dev/router"
import { Environment } from "!/types"

export default class extends Router {
	constructor() {
		super("/")

		this.useRouter(new ChatRouter())
		this.useRouter(new APIRouter())

		switch(this.environment) {
			case Environment.Development:
				this.useRouter(new DevRouter())
			default:
		}
	}
}
