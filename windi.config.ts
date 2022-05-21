import { defineConfig } from "windicss/helpers"

export default defineConfig({
	scan: {
		dirs: ["pages"],
		fileExtensions: ["vue", "js", "ts"]
	}
})
