import GetList from "!%/api/consultation/list.get"
import PostCreate from "!%/api/consultation/create.post"
import PatchRestore from "!%/api/consultation/restore.patch"
import DeleteArchive from "!%/api/consultation/archive.delete"
import PatchUpdate from "!%/api/consultation/update(id).patch"
import GetReadTimeSumPerWeek from "!%/api/consultation/read_time_sum_per_week.get"
import GetReadTimeSumPerStudent from "!%/api/consultation/read_time_sum_per_student.get"
import GetGenerateToken from "!%/api/consultation/generate_token(id)(channel_name)(uid).get"
import GetReadTimeSumForConsolidation from "!%/api/consultation/read_time_sum_for_consolidation.get"

export const controllers = [
	GetList,
	PostCreate,
	PatchUpdate,
	PatchRestore,
	DeleteArchive,
	GetGenerateToken,
	GetReadTimeSumPerWeek,
	GetReadTimeSumPerStudent,
	GetReadTimeSumForConsolidation
]
