import Router from "!/bases/router"
import TagRouter from "!%/api/tag/router"
import UserRouter from "!%/api/user/router"
import RoleRouter from "!%/api/role/router"
import PostRouter from "!%/api/post/router"
import CommentRouter from "!%/api/comment/router"
import SemesterRouter from "!%/api/semester/router"
import DepartmentRouter from "!%/api/department/router"
import AuditTrailRouter from "!%/api/audit_trail/router"
import ProfanityFilterRouter from "!%/api/profanity_filter/router"
import BoundConsultationRouter from "!%/api/consultation(id)/router"
import AsynchronousFileRouter from "!%/api/asynchronous_file/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

import { controllers as signatureControllers } from "!%/api/signature/router"
import { controllers as userBindedControllers } from "!%/api/user(id)/router"
import { controllers as profilePictureControllers } from "!%/api/profile_picture/router"
import { controllers as employeeScheduleControllers } from "!%/api/employee_schedule/router"

import { controllers as chatMessageControllers } from "!%/api/chat_message/router"
import { controllers as consultationControllers } from "!%/api/consultation/router"
import { controllers as attachedChatFileControllers } from "!%/api/attached_chat_file/router"
import { controllers as chatMessageActivityControllers } from "!%/api/chat_message_activity/router"
export default class extends Router {
	constructor() {
		super()

		const coreRouters = [
			RoleRouter,
			UserRouter,
			DepartmentRouter
		]

		const userRelatedControllers = [
			...signatureControllers,
			...userBindedControllers,
			...profilePictureControllers,
			...employeeScheduleControllers
		]

		const consultationRelatedControllers = [
			...chatMessageControllers,
			...consultationControllers,
			...attachedChatFileControllers,
			...chatMessageActivityControllers
		]
		const consultationRelatedRouters = [
			BoundConsultationRouter
		]

		const forumRelatedRouters = [
			TagRouter,
			PostRouter,
			CommentRouter,
			ProfanityFilterRouter
		]

		const miscelleneousRouters = [
			SemesterRouter,
			AuditTrailRouter,
			AsynchronousFileRouter
		]

		this.useControllersAsync(
			instantiateSimultaneously([
				...userRelatedControllers,
				...consultationRelatedControllers
			])
		)

		this.useRoutersAsync(
			instantiateSimultaneously([
				...coreRouters,
				...forumRelatedRouters,
				...consultationRelatedRouters,
				...miscelleneousRouters
			])
		)
	}
}
