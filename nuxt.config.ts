import { defineNuxtConfig } from "nuxt"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	head: {
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" }
		]
	},
	ssr: true,
	runtimeConfig: {
		app: {
			cert: process.env.NITRO_SSL_CERT,
			key: process.env.NITRO_SSL_KEY,
			port: (process.env.PORT || 3000) as number,
			baseURL: "/",

			get isSecure() {
				return this.cert && this.key
			},

			get origin() {
				const HTTPVersion = process.env.PROTOCOL || (this.isSecure ? "https" : "http")
				return `${HTTPVersion}://${this.host}:${this.port}`
			},

			get baseURI() {
				return `${this.origin}${this.baseURL}`
			}
		}
	}
})
