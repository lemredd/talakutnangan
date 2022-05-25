import { Request, Response, router as createRouter } from "express"
import RequestEnvironment from "./request_environment";

export default abstract class {
	const #environment: RequestEnvironment = RequestEnvironment.current
	const #router = createRouter()
}
