import { v4, v5 } from "uuid"
import { useCookie, setCookie, CompatibilityEvent } from "h3"
import Session, { SESSION_KEY, XSRF_KEY} from "~/server/auth/session"

const session = new Map<string, Session>()

export default function(event: CompatibilityEvent) {
	let id = useCookie(event, SESSION_KEY) || v5(SESSION_KEY, v4())
	const currentSession = session.get(id) || new Session()

	const regenerateToken = () => {
		currentSession.XSRFToken = v5(XSRF_KEY, v4())
	}

	const saveSession = () => {
		session.set(id, currentSession)
		setCookie(event, SESSION_KEY, id)
		setCookie(event, XSRF_KEY, currentSession.XSRFToken)
	}

	return {
		currentSession,
		regenerateToken,
		saveSession
	}
}
