import GetList from "!%/api/consultation/list.get"
import PostCreate from "!%/api/consultation/create.post"
import PatchUpdate from "!%/api/consultation/update(id).patch"
import GetReadTimeSumByWeek from "!%/api/consultation/read_time_sum_per_week.get"
import GetReadTimeSumByStudent from "!%/api/consultation/read_time_sum_per_student.get"
// import PatchRestore from "!%/api/consultation/restore.patch"
// import DeleteArchive from "!%/api/consultation/archive.delete"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	GetReadTimeSumByWeek,
	GetReadTimeSumByStudent
]
