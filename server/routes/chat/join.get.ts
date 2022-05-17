import { v4 } from "uuid"

export default defineEventHandler(event => {
	const configuration = useRuntimeConfig()
	const url = new URL(event.req.url, configuration.app.origin)

	if(url.pathname === "/chat/join") {
		event.res.writeHead(302, {
			Location: `/chat/${v4()}`
		})
	}

	event.res.end()
})
