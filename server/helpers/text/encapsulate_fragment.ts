import { readFile } from "fs"
import { promisify } from "util"
import { minify } from "html-minifier"

import getRoot from "!/helpers/get_root"

/**
 * Encapsulates the HTML fragment converted from Markdown syntax.
 *
 * @param title Title of the document. Usually, a subject of the e-mail message
 * @param styles Additional styles to apply aside from the defaults
 * @param fragment HTML fragement from converted Markdown syntax
 * @param defaultStylePath Path to default style. Defaults to the default style for e-mail messages.
 */
export default async function(
	title: string,
	styles: string,
	fragment: string,
	defaultStylePath: string = `${getRoot()}/email/defult.css`
): Promise<string> {
	const defaultStyles = (await promisify(readFile)(defaultStylePath)).toString()

	return minify(`
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8"/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			<title>${title}</title>
			<style>
				${defaultStyles}
				${styles}
			</style>
		</head>
		<body>
			${fragment}
		</body>
	</html>
	`, {
		collapseInlineTagWhitespace: true,
		collapseWhitespace: true,
		keepClosingSlash: true,
		minifyCSS: true,
		removeEmptyElements: true,
		sortAttributes: true,
		sortClassName: true
	})
}
