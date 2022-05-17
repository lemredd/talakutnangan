import useDatabase from "~/composables/useDatabase"

export default defineEventHandler(async event => {
	const { manager, User } = await useDatabase()
	await manager.upsert(User, [
		{
			email: "sample@gmail.com"
		}
	], [ "email" ])
	event.res.statusCode = 201
	event.res.end()
})
