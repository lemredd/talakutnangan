import Router from "!/bases/router"
import TagRouter from "!%/api/tag/router"
import UserRouter from "!%/api/user/router"
import RoleRouter from "!%/api/role/router"
import PostRouter from "!%/api/post/router"
import CommentRouter from "!%/api/comment/router"
import SemesterRouter from "!%/api/semester/router"
import UserBindedRouter from "!%/api/user(id)/router"
import SignatureRouter from "!%/api/signature/router"
import DepartmentRouter from "!%/api/department/router"
import AuditTrailRouter from "!%/api/audit_trail/router"
import ProfilePictureRouter from "!%/api/profile_picture/router"
import ProfanityFilterRouter from "!%/api/profanity_filter/router"
import BoundConsultationRouter from "!%/api/consultation(id)/router"
import EmployeeScheduleRouter from "!%/api/employee_schedule/router"
import AsynchronousFileRouter from "!%/api/asynchronous_file/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

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

		const userRelatedRouters = [
			SignatureRouter,
			UserBindedRouter,
			ProfilePictureRouter,
			EmployeeScheduleRouter
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
				...consultationRelatedControllers
			])
		)

		this.useRoutersAsync(
			instantiateSimultaneously([
				...coreRouters,
				...userRelatedRouters,
				...forumRelatedRouters,
				...consultationRelatedRouters,
				...miscelleneousRouters
			])
		)
	}
}
