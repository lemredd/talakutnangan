import Router from "!/bases/router"
import TagRouter from "!%/api/tag/router"
import UserRouter from "!%/api/user/router"
import RoleRouter from "!%/api/role/router"
import PostRouter from "!%/api/post/router"
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
import AttachedChatFileRouter from "!%/api/attached_chat_file/router"
import ChatMessageActivityRouter from "!%/api/chat_message_activity/router"

export default class extends Router {
	constructor() {
		super()

		const coreRouters = new Promise<Router[]>(resolve => {
			resolve([
				new RoleRouter(),
				new UserRouter(),
				new DepartmentRouter()
			])
		})

		const userRelatedRouters = new Promise<Router[]>(resolve => {
			resolve([
				new SignatureRouter(),
				new UserBindedRouter(),
				new ProfilePictureRouter(),
				new EmployeeScheduleRouter()
			])
		})

		const consultationRelatedRouters = new Promise<Router[]>(resolve => {
			resolve([
				new ChatMessageRouter(),
				new ConsultationRouter(),
				new AttachedChatFileRouter(),
				new BoundConsultationRouter(),
				new ChatMessageActivityRouter()
			])
		})

		const forumRelatedRouters = new Promise<Router[]>(resolve => {
			resolve([
				new TagRouter(),
				new PostRouter(),
				new ProfanityFilterRouter()
			])
		})

		const miscelleneousRouters = new Promise<Router[]>(resolve => {
			resolve([
				new SemesterRouter(),
				new AuditTrailRouter()
			])
		})

		this.useRoutersAsync(
			Promise.all([
				coreRouters,
				userRelatedRouters,
				forumRelatedRouters,
				consultationRelatedRouters,
				miscelleneousRouters
			]).then(routerGroups => routerGroups.flat())
		)
	}
}
