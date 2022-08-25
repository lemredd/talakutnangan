import { UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import ssr from "vite-plugin-ssr/plugin"
import tsconfig from "vite-tsconfig-paths"
import windicss from "vite-plugin-windicss"
import { resolve } from "path"

const configuration: UserConfig = {
	"plugins": [
		tsconfig(),
		vue({
			"reactivityTransform": true
		}),
		ssr(),
		windicss({
			"scan": {
				"dirs": [ "pages", "renderer", "components" ],
				"fileExtensions": [ "vue", "js", "ts" ]
			}
		})
	],
	"resolve": {
		"alias": {
			"@styles": resolve(__dirname, "styles")
		}
	}
}

if (process.env.NODE_ENV === "dev") {
	configuration.server = {
		"hmr": {
			"host": "localhost",
			"protocol": "ws"
		}
	}
}

export default configuration
