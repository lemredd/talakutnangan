import { defineConfig } from "vite";
import pluginVue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
	"plugins": [
		pluginVue()
	],
	"resolve": {
		"alias": {
			"@": resolve(__dirname, "src")
		}
	},
	"server": {
		"host": true,
		"port": 8000,
		"open": false,
		"watch": {
			"usePolling": true
		}
	}
});
