import { UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import ssr from "vite-plugin-ssr/plugin"
import tsconfig from "vite-tsconfig-paths"
import windicss from "vite-plugin-windicss"
import { resolve } from "path"
import RequestEnvironment from "./shareable/helpers/request_environment"

const config: UserConfig = {
	"resolve": {
		"alias": {
			"@styles": resolve(__dirname, "styles")
		}
	},
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
	]
}

if (RequestEnvironment.isNotOnProduction) {
	config.server = {
		"hmr": {
			"host": "localhost",
			"protocol": "ws"
		}
	}
}

export default config
