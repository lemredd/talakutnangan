import destr from "destr"
import { defineNuxtConfig } from "nuxt"
import createWebSocket from "./custom/create_ws_server"
import registerWSEvents from "./custom/register_ws_events"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	head: {
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" }
		]
	},
	ssr: true,
	vite: {
		server: {
			host: true,
			port: 8000,
			open: false,
			watch: {
				usePolling: true
			}
		}
	}
})
