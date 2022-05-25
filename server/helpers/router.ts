import { Request, Response, router as createRouter } from "express"
import RequestEnvironment from "./request_environment";

export default abstract class {
	private const environment: RequestEnvironment = RequestEnvironment.current
	private const router = createRouter()
}
