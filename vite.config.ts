import vue from "@vitejs/plugin-vue"
import ssr from "vite-plugin-ssr/plugin"
import tsconfig from "vite-tsconfig-paths"
import windicss from "vite-plugin-windicss"
import { UserConfig } from "vite"

const config: UserConfig = {
	plugins: [
		tsconfig(),
		vue({
			reactivityTransform: true
		}),
		ssr(),
		windicss()
	],
}

export default config
