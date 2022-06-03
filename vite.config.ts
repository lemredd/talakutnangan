import { UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import ssr from "vite-plugin-ssr/plugin"
import tsconfig from "vite-tsconfig-paths"
import windicss from "vite-plugin-windicss"

const config: UserConfig = {
	plugins: [
		tsconfig(),
		vue({
			reactivityTransform: true
		}),
		ssr(),
		windicss({
			scan: {
				dirs: ["pages"],
				fileExtensions: ["vue", "js", "ts"]
			}
		})
	],
}

export default config
