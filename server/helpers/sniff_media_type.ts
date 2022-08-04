import { Magic, MAGIC_MIME_TYPE } from "mmmagic"

const magic = new Magic(MAGIC_MIME_TYPE)

export default async function(buffer: Buffer): Promise<string|undefined> {
	return await new Promise((resolve, reject) => {
		magic.detect(buffer, (error, result) => {
			if (error) reject(error)
			else resolve(result as string)
		})
	})
}
