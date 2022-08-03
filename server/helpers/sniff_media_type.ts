import { fileTypeFromBuffer } from "file-type"

export default async function(buffer: ArrayBuffer): Promise<string|undefined> {
	return (await fileTypeFromBuffer(buffer))?.mime
}
