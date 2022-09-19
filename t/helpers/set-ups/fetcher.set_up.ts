import BaseFetcher from "$@/fetchers/base"
import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
import ChatMessageFetcher from "$@/fetchers/chat_message"
import ConsultationFetcher from "$@/fetchers/consultation"
import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"

beforeEach(() => {
	BaseFetcher.initialize("/api")
	UserFetcher.initialize("/api")
	RoleFetcher.initialize("/api")
	DepartmentFetcher.initialize("/api")
	ChatMessageFetcher.initialize("/api")
	ConsultationFetcher.initialize("/api")
	EmployeeScheduleFetcher.initialize("/api")
})
