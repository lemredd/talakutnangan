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
import ChatMessageRouter from "!%/api/chat_message/router"
import ConsultationRouter from "!%/api/consultation/router"
import ProfilePictureRouter from "!%/api/profile_picture/router"
import ProfanityFilterRouter from "!%/api/profanity_filter/router"
import BoundConsultationRouter from "!%/api/consultation(id)/router"
import EmployeeScheduleRouter from "!%/api/employee_schedule/router"
import AsynchronousFileRouter from "!%/api/asynchronous_file/router"
import AttachedChatFileRouter from "!%/api/attached_chat_file/router"
import ChatMessageActivityRouter from "!%/api/chat_message_activity/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

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

		const consultationRelatedRouters = [
			ChatMessageRouter,
			ConsultationRouter,
			AttachedChatFileRouter,
			BoundConsultationRouter,
			ChatMessageActivityRouter
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
