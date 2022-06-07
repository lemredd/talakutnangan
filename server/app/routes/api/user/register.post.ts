import { UserKind } from "%/types"
import { Response } from "!/types/dependent"
import { RequestWithRegistration as Request }  from "!/types/hybrid"

import Middleware from "!/bases/middleware"
import UserManager from "%/managers/user_manager"
import LogInController from "!/app/routes/api/user/log_in.post"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import GuestFormController from "!/app/routes/kinds/guest_form_controller"

export default class extends GuestFormController {
	get filePath(): string { return __filename }

	get validationRules(): object {
		return {
			email: [ "required", "string", "email", "maxLength:255" ],
			password: [ "required", "string", "minLength:8" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new UserManager()
		const { email, password } = request.body

		// TODO: Handle duplicated emails
		const user = await manager.create({
			email,
			password,
			kind: UserKind.Student
		})

		request.user = user
	}

	get postJobs(): Middleware[] {
		return [
			...super.postJobs,
			new LogInController(),
			CommonMiddlewareList.emailVerificationSender
		]
	}
}
