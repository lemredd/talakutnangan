import { minify } from "html-minifier"

export default function(title: string, styles: string, fragment: string): string {
	return minify(`
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8"/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			<title>${title}</title>
			<style>
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
