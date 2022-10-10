import { readFile } from "fs"
import { promisify } from "util"
import { minify } from "html-minifier"
import template from "string-placeholder"
import { Processor } from "windicss/lib"
import { CSSParser, HTMLParser } from "windicss/utils/parser"

import getRoot from "$!/helpers/get_root"

function makeRawHTML(title: string, styles: string, fragment: string): string {
	return `
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
			<div>
				${fragment}
			</div>
		</body>
	</html>
	`
}

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
	defaultStylePath = `${getRoot()}/email/default.scss`,
	variablesStylePath = `${getRoot()}/styles/variables.scss`
): Promise<string> {
	const defaultStyles = (await promisify(readFile)(defaultStylePath)).toString()
	const variablesStyleContent = (await promisify(readFile)(variablesStylePath)).toString()
	const variablesStyles = variablesStyleContent
	.split("\n")
	.filter(line => line.startsWith("$"))
	.map(variableLine => variableLine.split(":"))
	.reduce((previousObject, currentVariableInfo) => ({
		...previousObject,
		/*
		 * ! risky when variables depend on other variables
		 * ! risky: will not work on other scss features
		 */
		[currentVariableInfo[0].slice(1)]: currentVariableInfo[1].trim()
	}), {})
	const precombinedRawStyles = `${defaultStyles}${styles}`
	const specializedPrecombinedRawStyles = template(precombinedRawStyles, variablesStyles, {
		"after": ";",
		"before": "$"
	})

	const rawHTML = makeRawHTML(title, specializedPrecombinedRawStyles, fragment)

	// Please see: https://windicss.org/integrations/javascript.html
	const processor = new Processor()
	const classes = new HTMLParser(rawHTML)
	.parseClasses()
	.map(className => className.result)
	.join(" ")
	const processedPrecombinedStyles = new CSSParser(
		specializedPrecombinedRawStyles,
		processor
	).parse()

	const preflightSheet = processor.preflight(rawHTML)
	const interpretedSheet = processor.interpret(classes).styleSheet
	const combinedStyles = interpretedSheet
	.extend(preflightSheet, true)
	.extend(processedPrecombinedStyles, true)
	const builtStyles = combinedStyles.build(true)

	const styleOptimizedHTML = makeRawHTML(title, builtStyles, fragment)
	return minify(styleOptimizedHTML, {
		"collapseInlineTagWhitespace": true,
		"collapseWhitespace": true,
		"keepClosingSlash": true,
		"minifyCSS": true,
		"removeEmptyElements": true,
		"sortAttributes": true,
		"sortClassName": true
	})
}
