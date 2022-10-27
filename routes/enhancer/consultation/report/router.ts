import GetWeeklyReportRoute from "!%/enhancer/consultation/report/weekly.get"
import GetReportPerStudentRoute from "!%/enhancer/consultation/report/per_student.get"
import GetConsolidatedReportRoute from "!%/enhancer/consultation/report/consolidated.get"

export const controllers = [
	GetReportPerStudentRoute,
	GetWeeklyReportRoute,
	GetConsolidatedReportRoute
]
