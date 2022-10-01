import makeTemplateLink from "$/helpers/make_template_link"
/**
 * Use by most of the template links.
 */
export const LINK_PREFIX = "/api"

/**
 * Requires the `id` of the user
 */
export const UPDATE_PASSWORD_LINK = "/api/user/:id/update_password"

export const CONSULTATION_LINK = makeTemplateLink(LINK_PREFIX, "consultation")
