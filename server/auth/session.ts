import { v4, v5 } from "uuid"

export const SESSION_KEY = "session"
export const XSRF_KEY = "XSRF-Token"

export default class Session {
	// Email of current user
	email: string|null = null
	XSRFToken: string|null = v5(XSRF_KEY, v4())
}
