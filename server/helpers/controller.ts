import { Request, Response } from "express"
import RequestEnvironment from "./request_environment";

export default abstract class {
	const #environment: RequestEnvironment = RequestEnvironment.current

	static abstract handle(request: Request, response: Response): void
}
