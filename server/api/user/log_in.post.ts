import useSession from "~/server/auth/useSession"
import useDatabase from "~/composables/useDatabase"

export default defineEventHandler(async event => {
	const { User } = useDatabase()
	const { currentSession, regenerateToken, saveSession } = useSession(event)
	const { body } = await useBody(event)

	// TODO: Validation

	const user = await User.findOne({ where: body })

	if (user === null) {
		event.res.statusCode = 401
		saveSession()
		event.res.end()
	} else {
		currentSession.email = user.email
		event.res.statusCode = 200
		regenerateToken()
		saveSession()
		event.res.end()
	}
})
