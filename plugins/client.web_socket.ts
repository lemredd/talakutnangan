import client from "socket.io-client"

export default defineNuxtPlugin(nuxtApp => {
	return {
		provide: {
			webSocketClient: (namespace = "/") => client(namespace)
		}
	}
})
