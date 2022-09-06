import Router from "!/bases/router"
import UserRouter from "!%/api/user/router"
import RoleRouter from "!%/api/role/router"
import UserBindedRouter from "!%/api/user(id)/router"
import SignatureRouter from "!%/api/signature/router"
import DepartmentRouter from "!%/api/department/router"
import AuditTrailRouter from "!%/api/audit_trail/router"
import ChatMessageRouter from "!%/api/chat_message/router"
import ProfilePictureRouter from "!%/api/profile_picture/router"
import EmployeeScheduleRouter from "!%/api/employee_schedule/router"
import ChatMessageActivityRouter from "!%/api/chat_message_activity/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new UserRouter(),
			new RoleRouter(),
			new SignatureRouter(),
			new AuditTrailRouter(),
			new DepartmentRouter(),
			new UserBindedRouter(),
			new ChatMessageRouter(),
			new ProfilePictureRouter(),
			new EmployeeScheduleRouter(),
			new ChatMessageActivityRouter()
		])
	}
}
