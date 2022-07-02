import { resolve } from "path"

export default function(): string {
	return resolve(__dirname, "../..")
}
