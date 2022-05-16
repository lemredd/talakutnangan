import useDatabase from "~/composables/useDatabase"

export default defineEventHandler(async event => {
	const { User } = useDatabase()

	await User.findOrCreate({
		where: {
			email: "sample@gmail.com"
		}
	})
	event.res.statusCode = 201
	event.res.end()
})
