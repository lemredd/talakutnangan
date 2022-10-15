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
import EmployeeScheduleRouter from "!%/api/employee_schedule/router"
import AttachedChatFileRouter from "!%/api/attached_chat_file/router"
import ChatMessageActivityRouter from "!%/api/chat_message_activity/router"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(new Promise(resolve => {
			resolve([
				new TagRouter(),
				new UserRouter(),
				new RoleRouter(),
				new PostRouter(),
				new SemesterRouter(),
				new SignatureRouter(),
				new AuditTrailRouter(),
				new DepartmentRouter(),
				new UserBindedRouter(),
				new ChatMessageRouter(),
				new ConsultationRouter(),
				new ProfilePictureRouter(),
				new ProfanityFilterRouter(),
				new EmployeeScheduleRouter(),
				new AttachedChatFileRouter(),
				new ChatMessageActivityRouter()
			])
		}))
	}
}
