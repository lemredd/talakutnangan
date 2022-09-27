import BaseFetcher from "$@/fetchers/base"
import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import SignatureFetcher from "$@/fetchers/signature"
import DepartmentFetcher from "$@/fetchers/department"
import ChatMessageFetcher from "$@/fetchers/chat_message"
import ConsultationFetcher from "$@/fetchers/consultation"
import ProfilePictureFetcher from "$@/fetchers/profile_picture"
import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"

beforeEach(() => {
	BaseFetcher.initialize("/api")
	UserFetcher.initialize("/api")
	RoleFetcher.initialize("/api")
	SignatureFetcher.initialize("/api")
	DepartmentFetcher.initialize("/api")
	ChatMessageFetcher.initialize("/api")
	ConsultationFetcher.initialize("/api")
	ProfilePictureFetcher.initialize("/api")
	EmployeeScheduleFetcher.initialize("/api")
	ChatMessageActivityFetcher.initialize("/api")
})
