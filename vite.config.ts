import "dotenv/config"
import { UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import ssr from "vite-plugin-ssr/plugin"
import tsconfig from "vite-tsconfig-paths"
import windicss from "vite-plugin-windicss"
import { resolve } from "path"

const configuration: UserConfig = {
	"legacy": {
		"buildSsrCjsExternalHeuristics": true
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
	],
	"resolve": {
		"alias": {
			"@styles": resolve(__dirname, "styles")
		}
	}
}

if (process.env.NODE_ENV === "dev" && process.env.WEB_PROXY === "true") {
	configuration.server = {
		"hmr": {
			"clientPort": Number(process.env.PORT ?? "16000"),
			"host": "localhost",
			"port": Number(process.env.PORT ?? "16000"),
			"protocol": "ws"
		}
	}
}

export default configuration
