import { readFile } from "fs"
import { promisify } from "util"
import specializeTemplate from "!/helpers/specialize_template"
import getRoot from "!/helpers/get_root"

export default async function(templatePathFromRoot: string, variables: object)
	: Promise<{ raw: string, html: string }> {
	const completeTemplatePath = `${getRoot()}/${templatePathFromRoot}`
	const raw = (await promisify(readFile)(completeTemplatePath)).toString()
	const html = specializeTemplate(raw, variables)

	return { raw, html }
}
