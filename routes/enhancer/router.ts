import ControllerLike from "!/bases/controller-like"
import RequestEnvironment from "$!/singletons/request_environment"

import GetHome from "!%/enhancer/home.get"
import GetIndex from "!%/enhancer/index.get"
import { controllers as tagControllers } from "!%/enhancer/tag/router"
import { controllers as userControllers } from "!%/enhancer/user/router"
import { controllers as roleControllers } from "!%/enhancer/role/router"
import { controllers as postControllers } from "!%/enhancer/post/router"
import { controllers as forumControllers } from "!%/enhancer/forum/router"
import { controllers as semesterControllers } from "!%/enhancer/semester/router"
import { controllers as departmentControllers } from "!%/enhancer/department/router"
import { controllers as userSettingsControllers } from "!%/enhancer/settings/router"
import { controllers as auditTrailControllers } from "!%/enhancer/audit_trail/router"
import { controllers as consultationControllers } from "!%/enhancer/consultation/router"

export const controllers: (new() => ControllerLike)[] = RequestEnvironment.isInMaintenanceMode
	? [ GetIndex ]
	: [
		...tagControllers,
		...userControllers,
		...roleControllers,
		...postControllers,
		...forumControllers,
		...auditTrailControllers,
		...semesterControllers,
		...departmentControllers,
		...consultationControllers,
		...userSettingsControllers,
		GetHome,
		GetIndex
	]
