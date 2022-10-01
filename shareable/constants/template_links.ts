import makeTemplateLink from "$/helpers/MAKE_TEMPLATE_LINK"

/**
 * Use by most of the template links.
 */
export const LINK_PREFIX = "/api"

/**
 * Requires the `id` of the user
 */
export const UPDATE_PASSWORD_LINK = "/api/user/:id/update_password"

export const AUDIT_TRAIL_LINK = makeTemplateLink(LINK_PREFIX, "audit_triail")

export const USER_LINK = makeTemplateLink(LINK_PREFIX, "user")

export const ROLE_LINK = makeTemplateLink(LINK_PREFIX, "role")

export const DEPARTMENT_LINK = makeTemplateLink(LINK_PREFIX, "department")

export const PROFILE_PICTURE_LINK = makeTemplateLink(LINK_PREFIX, "profile_picture")

export const SIGNATURE_LINK = makeTemplateLink(LINK_PREFIX, "signature")

export const EMPLOYEE_SCHEDULE_LINK = makeTemplateLink(LINK_PREFIX, "employee_schedule")

export const CONSULTATION_LINK = makeTemplateLink(LINK_PREFIX, "consultation")

export const CHAT_MESSAGE_LINK = makeTemplateLink(LINK_PREFIX, "chat_message")

export const CHAT_MESSAGE_ACTIVITY_LINK = makeTemplateLink(LINK_PREFIX, "chat_message_activity")
