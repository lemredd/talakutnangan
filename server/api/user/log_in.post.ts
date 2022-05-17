import useSession from "~/server/auth/useSession"
import useDatabase from "~/composables/useDatabase"

export default defineEventHandler(async event => {
	const { manager, User } = await useDatabase()
	const { currentSession, regenerateToken, saveSession } = useSession(event)
	// const { body } = await useBody(event)
	const body = { email: "sample@gmail.com" }

	// TODO: Validation

	const user = await manager.findOne(User, { where: body })

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
