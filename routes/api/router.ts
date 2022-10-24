import ControllerLike from "!/bases/controller-likes/controller"

import { controllers as semesterControllers } from "!%/api/semester/router"
import { controllers as auditTrailControllers } from "!%/api/audit_trail/router"
import { controllers as asynchronousFileControllers } from "!%/api/asynchronous_file/router"

import { controllers as tagControllers } from "!%/api/tag/router"
import { controllers as postControllers } from "!%/api/post/router"
import { controllers as commentControllers } from "!%/api/comment/router"
import { controllers as boundPostControllers } from "!%/api/post(id)/router"
import { controllers as commentVoteControllers } from "!%/api/comment_vote/router"
import { controllers as postAttachmentControllers } from "!%/api/post_attachment/router"
import { controllers as profanityFilterControllers } from "!%/api/profanity_filter/router"

import { controllers as userControllers } from "!%/api/user/router"
import { controllers as roleControllers } from "!%/api/role/router"
import { controllers as departmentControllers } from "!%/api/department/router"

import { controllers as signatureControllers } from "!%/api/signature/router"
import { controllers as userBindedControllers } from "!%/api/user(id)/router"
import { controllers as profilePictureControllers } from "!%/api/profile_picture/router"
import { controllers as employeeScheduleControllers } from "!%/api/employee_schedule/router"

import { controllers as chatMessageControllers } from "!%/api/chat_message/router"
import { controllers as consultationControllers } from "!%/api/consultation/router"
import { controllers as attachedChatFileControllers } from "!%/api/attached_chat_file/router"
import { controllers as chatMessageActivityControllers } from "!%/api/chat_message_activity/router"

const coreControllers = [
	...userControllers,
	...roleControllers,
	...departmentControllers
]

const userRelatedControllers = [
	...signatureControllers,
	...userBindedControllers,
	...profilePictureControllers,
	...employeeScheduleControllers
]

const consultationRelatedControllers = [
	...chatMessageControllers,
	...consultationControllers,
	...attachedChatFileControllers,
	...chatMessageActivityControllers
]

const forumRelatedControllers = [
	...tagControllers,
	...postControllers,
	...commentControllers,
	...boundPostControllers,
	...postAttachmentControllers,
	...profanityFilterControllers,
	...commentVoteControllers
]

const miscelleneousControllers = [
	...semesterControllers,
	...auditTrailControllers,
	...asynchronousFileControllers
]

export const controllers: (new() => ControllerLike)[] = [
	...coreControllers,
	...userRelatedControllers,
	...consultationRelatedControllers,
	...forumRelatedControllers,
	...miscelleneousControllers
]
