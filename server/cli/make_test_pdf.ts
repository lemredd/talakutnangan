import { writeFile } from "fs"
import { promisify } from "util"

import { generatePdf } from "html-pdf-node-ts"

import RequestEnvironment from "$!/singletons/request_environment"

async function main() {
	console.log("Generating PDF...")

	const outputPath = `${RequestEnvironment.root}/t/data/hidden_test.pdf`
	const outputContents = await generatePdf({
		"url": "https://example.com"
	})
	await promisify(writeFile)(outputPath, outputContents)

	console.log("PDF Generated.")
}

main()
