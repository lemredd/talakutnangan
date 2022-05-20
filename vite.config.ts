import vue from "@vitejs/plugin-vue"
import ssr from "vite-plugin-ssr/plugin"
import tsconfig from "vite-tsconfig-paths"
import { UserConfig } from "vite"

const config: UserConfig = {
	plugins: [tsconfig(), vue(), ssr()],
}

export default config
