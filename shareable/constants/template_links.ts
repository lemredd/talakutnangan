import makeTemplateLink from "$/helpers/make_template_link"

/**
 * Use by most of the template links.
 */
export const LINK_PREFIX = "/api"

export const AUDIT_TRAIL_LINK = makeTemplateLink(LINK_PREFIX, "audit_trail")

export const USER_LINK = makeTemplateLink(LINK_PREFIX, "user")

export const COMMENT_LINK = makeTemplateLink(LINK_PREFIX, "comment")

export const COMMENT_VOTE_LINK = makeTemplateLink(LINK_PREFIX, "comment_vote")

export const TAG_LINK = makeTemplateLink(LINK_PREFIX, "tag")

export const PROFANITY_FILTER_LINK = makeTemplateLink(LINK_PREFIX, "profanity_filter")

/**
 * Requires the `id` of the user
 */
export const UPDATE_PASSWORD_LINK = `${USER_LINK.bound}/update_password`

export const LOG_IN_LINK = `${USER_LINK.unbound}/log_in`

export const LOG_OUT_LINK = `${USER_LINK.unbound}/log_out`

export const IMPORT_USER_LINK = `${USER_LINK.unbound}/import`

export const ROLE_LINK = makeTemplateLink(LINK_PREFIX, "role")

export const DEPARTMENT_LINK = makeTemplateLink(LINK_PREFIX, "department")

export const PROFILE_PICTURE_LINK = makeTemplateLink(LINK_PREFIX, "profile_picture")

export const SIGNATURE_LINK = makeTemplateLink(LINK_PREFIX, "signature")

export const EMPLOYEE_SCHEDULE_LINK = makeTemplateLink(LINK_PREFIX, "employee_schedule")

export const CONSULTATION_LINK = makeTemplateLink(LINK_PREFIX, "consultation")

export const CHAT_MESSAGE_LINK = makeTemplateLink(LINK_PREFIX, "chat_message")

export const CHAT_MESSAGE_ACTIVITY_LINK = makeTemplateLink(LINK_PREFIX, "chat_message_activity")

export const POST_LINK = makeTemplateLink(LINK_PREFIX, "post")

export const POST_ATTACHMENT_LINK = makeTemplateLink(LINK_PREFIX, "post_attachment")

export const SEMESTER_LINK = makeTemplateLink(LINK_PREFIX, "semester")

export const ASYNCHRONOUS_FILE = makeTemplateLink(LINK_PREFIX, "asynchronous_file")

/**
 * Requires the `id` of the user
 */
export const UPDATE_DEPARTMENT_OF_USER_LINK
= `${USER_LINK.bound}/relationships/${DEPARTMENT_LINK.type}`

/**
 * Requires the `id` of the user
 */
export const UPDATE_ROLE_OF_USER_LINK = `${USER_LINK.bound}/relationships/${ROLE_LINK.type}`

/**
 * Requires the `id` of the user
 */
export const UPDATE_SIGNATURE_OF_USER_LINK
= `${USER_LINK.bound}/relationships/${SIGNATURE_LINK.type}`

/**
 * Requires the `id` of the user
 */
export const UPDATE_PROFILE_PICTURE_OF_USER_LINK
= `${USER_LINK.bound}/relationships/${PROFILE_PICTURE_LINK.type}`

export const CREATE_CHAT_MESSAGE_WITH_FILE_LINK = `${CHAT_MESSAGE_LINK.unbound}/create_with_file`

export const COUNT_COMMENT_VOTES = `${COMMENT_LINK.unbound}/count_votes?:query`

/**
 * Link for generating RTC Token
 */
// eslint-disable-next-line max-len
export const RTC_TOKEN_LINK = ":hostName/rtc/:channelName/1/uid/:uid/?expiry=300"

/**
 * Requires the time sum query parameters
 */
export const READ_TIME_SUM_PER_STUDENT
= `${CONSULTATION_LINK.unbound}/read_time_sum_per_student?:query`

/**
 * Requires the time sum query parameters
 */
export const READ_TIME_SUM_PER_WEEK
= `${CONSULTATION_LINK.unbound}/read_time_sum_per_week?:query`

/**
 * Requires the time sum query parameters
 */
export const READ_TIME_SUM_FOR_CONSOLIDATION
= `${CONSULTATION_LINK.unbound}/read_time_sum_for_consolidation?:query`

/**
 * Requires the `id` of the consultation, `channelName` within the consultation, and `uid` which is
 * the chat message activity of the current user.
 */
export const READ_GENERATED_RTC_TOKEN
= `${CONSULTATION_LINK.unbound}/generate_token/:id/:channelName/:uid`

export const COUNT_COMMENTS = `${POST_LINK.unbound}/count_comments`

export const COUNT_USERS_OF_DEPARTMENT = `${DEPARTMENT_LINK.unbound}/count_users?:query`
