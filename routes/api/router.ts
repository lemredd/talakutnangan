import Router from "!/bases/router"
import TagRouter from "!%/api/tag/router"
import PostRouter from "!%/api/post/router"
import CommentRouter from "!%/api/comment/router"
import SemesterRouter from "!%/api/semester/router"
import AuditTrailRouter from "!%/api/audit_trail/router"
import ProfanityFilterRouter from "!%/api/profanity_filter/router"
import BoundConsultationRouter from "!%/api/consultation(id)/router"
import AsynchronousFileRouter from "!%/api/asynchronous_file/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

import { controllers as userControllers } from "!%/api/user/router"
import { controllers as roleControllers } from "!%/api/role/router"
import { controllers as departmentControllers } from "!%/api/department/router"

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

		const coreControllers = [
			...userControllers,
			...roleControllers,
			...departmentControllers
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
				...coreControllers,
				...userRelatedControllers,
				...consultationRelatedControllers
			])
		)

		this.useRoutersAsync(
			instantiateSimultaneously([
				...forumRelatedRouters,
				...consultationRelatedRouters,
				...miscelleneousRouters
			])
		)
	}
}
