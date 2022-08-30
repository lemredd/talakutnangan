import BaseFetcher from "$@/fetchers/base"
import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
import ConsultationFetcher from "$@/fetchers/consultation"
import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"

beforeEach(() => {
	BaseFetcher.initialize("/api")
	UserFetcher.initialize("/api")
	RoleFetcher.initialize("/api")
	DepartmentFetcher.initialize("/api")
	ConsultationFetcher.initialize("/api")
	EmployeeScheduleFetcher.initialize("/api")
})
